const express = require("express");
const router = express.Router();

const Orders = require("../models/Orders");
const OrderItems = require("../models/OrderItems");
const ShoppingCartItem = require("../models/ShoppingCartItem");
const Item = require("../models/Item");
const Payment = require("../models/Payment");
const OrderProcessing = require("../models/OrderProcessing");
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { userId, paymentMethod, cartValidationData } = req.body;

  if (!userId || !paymentMethod || !Array.isArray(cartValidationData)) {
    return res.status(400).json({ error: "Missing data for validation" });
  }

  try {
    // 1. Get shopping cart items with price
    const cartItems = await ShoppingCartItem.findAll({
      where: { user_id: userId },
      include: [{ model: Item, attributes: ["price", "item_id"] }],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Check for mismatch
    const priceMismatch = cartItems.some((dbItem) => {
      const inputItem = cartValidationData.find(
        (i) => i.item_id === dbItem.item_id
      );
      if (!inputItem) return true;

      const dbPrice = parseFloat(dbItem.Item.price);
      const dbQty = parseFloat(dbItem.quantity);

      return (
        dbPrice !== parseFloat(inputItem.price) ||
        dbQty !== parseFloat(inputItem.quantity)
      );
    });

    if (priceMismatch) {
      return res
        .status(400)
        .json({ error: "Prices or quantities have changed" });
    }

    // 2. Calculate total price
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * parseFloat(item.Item.price),
      0
    );

    // 3. Create the order
    const order = await Orders.create({
      user_id: userId,
      status: `paid`,
      price: totalPrice,
      ordertime: new Date(),
      last_updatetime: new Date(),
    });

    // 4. Create order items
    const orderItemsData = cartItems.map((cartItem) => ({
      order_id: order.order_id,
      item_id: cartItem.item_id,
      quantity: cartItem.quantity,
      price_at_purchase: cartItem.Item.price,
    }));

    await OrderItems.bulkCreate(orderItemsData);

    // 5. Create a payment record
    await Payment.create({
      order_id: order.order_id,
      payment_method: paymentMethod,
      amount_paid: totalPrice,
      payment_status: "completed",
      paid_at: new Date(),
    });

    // 6. Clear the cart
    await ShoppingCartItem.destroy({ where: { user_id: userId } });

    return res.json({
      message: "Order and payment processed successfully",
      orderId: order.order_id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Orders.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItems,
          include: [{ model: Item }],
        },
      ],
      order: [["ordertime", "DESC"]],
    });

    return res.json(orders);
  } catch (error) {
    console.error("User order fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

router.post("/:orderId/pick", async (req, res) => {
  const { orderId } = req.params;
  const { staff_id } = req.body;

  if (!staff_id) {
    return res.status(400).json({ error: "Staff ID is required" });
  }

  try {
    // 1. Check if the order exists and is eligible
    const order = await Orders.findByPk(orderId);
    if (!order || order.status !== "paid") {
      return res.status(400).json({ error: "Invalid or already picked order" });
    }

    // 2. Prevent multiple staff from picking the same order
    const alreadyPicked = await OrderProcessing.findOne({
      where: { order_id: orderId },
    });
    if (alreadyPicked) {
      return res.status(400).json({ error: "Order already picked" });
    }

    // 3. Create order processing record
    await OrderProcessing.create({
      order_id: orderId,
      staff_id,
      status: "picked",
      picked_at: new Date(),
    });

    // 4. Update order status if needed
    await order.update({ status: "processing", last_updatetime: new Date() });

    res.json({ message: `Order ${orderId} picked by staff ${staff_id}` });
  } catch (error) {
    console.error("Error in picking order:", error);
    res.status(500).json({ error: "Failed to assign order to staff" });
  }
});

router.get("/pending", async (req, res) => {
  try {
    const orders = await Orders.findAll({
      where: { status: "paid" },
      include: [
        {
          model: OrderItems,
          include: [{ model: Item }],
        },
      ],
      order: [["ordertime", "ASC"]],
    });

    return res.json(orders);
  } catch (error) {
    console.error("Pending order fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch pending orders" });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Orders.findAll({
      include: [
        {
          model: OrderItems,
          include: [{ model: Item }],
        },
      ],
      order: [["ordertime", "DESC"]],
    });

    return res.json(orders);
  } catch (error) {
    console.error("All orders fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch all orders" });
  }
});

router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Orders.findByPk(orderId, {
      include: [
        {
          model: OrderItems,
          include: [
            {
              model: Item,
              attributes: ["item_name"],
            },
          ],
        },
        {
          model: Payment,
        },
        {
          model: OrderProcessing,
          include: [
            {
              model: User,
              as: "Staff",
              attributes: ["user_id", "username"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Format response
    const response = {
      order_id: order.order_id,
      user_id: order.user_id,
      status: order.status,
      price: order.price,
      ordertime: order.ordertime,
      last_updatetime: order.last_updatetime,
      OrderItems: order.OrderItems.map((orderItem) => ({
        item_id: orderItem.item_id,
        quantity: orderItem.quantity,
        price_at_purchase: orderItem.price_at_purchase,
        Item: orderItem.Item
          ? { item_name: orderItem.Item.item_name }
          : undefined,
      })),
      Payments: order.Payments.map((payment) => ({
        payment_id: payment.payment_id,
        payment_method: payment.payment_method,
        amount_paid: payment.amount_paid,
        payment_status: payment.payment_status,
        paid_at: payment.paid_at,
      })),
    };

    return res.json(response);
  } catch (err) {
    console.error("Error fetching order detail:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
