const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { user_id, status, price } = req.body;
  try {
    const newOrder = await Order.create({ user_id, status, price });
    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
