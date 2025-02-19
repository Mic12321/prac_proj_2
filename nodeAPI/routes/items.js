const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

router.get("/", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { item_name, item_description, stock_quantity, unit_name, price } =
    req.body;
  try {
    const newItem = await Item.create({
      item_name,
      item_description,
      stock_quantity,
      unit_name,
      price,
    });
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
