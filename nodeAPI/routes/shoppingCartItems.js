const express = require("express");
const router = express.Router();
const ShoppingCartItem = require("../models/ShoppingCartItem");
const Item = require("../models/Item");

router.get("/:userId", async (req, res) => {
  try {
    const cartItems = await ShoppingCartItem.findAll({
      where: { user_id: req.params.userId },
      include: [{ model: Item }],
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { user_id, item_id, quantity } = req.body;

    const item = await Item.findOne({ where: { item_id } });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (!item.for_sale) {
      return res.status(400).json({ error: "Item is not available for sale" });
    }

    let cartItem = await ShoppingCartItem.findOne({
      where: { user_id, item_id },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await ShoppingCartItem.create({ user_id, item_id, quantity });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:userId/:itemId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const { userId, itemId } = req.params;

    const cartItem = await ShoppingCartItem.findOne({
      where: { user_id: userId, item_id: itemId },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:userId/:itemId", async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    const deleted = await ShoppingCartItem.destroy({
      where: { user_id: userId, item_id: itemId },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await ShoppingCartItem.destroy({ where: { user_id: userId } });

    res.json({ message: "Shopping cart cleared" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
