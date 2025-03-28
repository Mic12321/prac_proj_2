const express = require("express");
const router = express.Router();
const ShoppingCartItem = require("../models/ShoppingCartItem");
const Item = require("../models/Item");
const User = require("../models/User");

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const cartItems = await ShoppingCartItem.findAll({
      where: { user_id: userId },
      include: [{ model: Item }],
    });

    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { user_id, item_id, quantity } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const item = await Item.findByPk(item_id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    if (!item.for_sale)
      return res.status(400).json({ error: "Item not for sale" });

    const [cartItem, created] = await ShoppingCartItem.findOrCreate({
      where: { user_id, item_id },
      defaults: { quantity },
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:userId/:itemId", async (req, res) => {
  try {
    console.log("hi");
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1)
      return res.status(400).json({ error: "Quantity must be at least 1" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const cartItem = await ShoppingCartItem.findOne({
      where: { user_id: userId, item_id: itemId },
    });
    if (!cartItem)
      return res.status(404).json({ error: "Item not found in cart" });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:userId/:itemId", async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const deleted = await ShoppingCartItem.destroy({
      where: { user_id: userId, item_id: itemId },
    });

    if (!deleted)
      return res.status(404).json({ error: "Item not found in cart" });

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await ShoppingCartItem.destroy({ where: { user_id: userId } });

    res.json({ message: "Shopping cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
