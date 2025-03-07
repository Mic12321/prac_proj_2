const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [{ model: Category }],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const {
    item_name,
    item_description,
    stock_quantity,
    unit_name,
    price,
    category_id,
    for_sale,
  } = req.body;
  try {
    const newItem = await Item.create({
      item_name,
      item_description,
      stock_quantity,
      unit_name,
      price,
      category_id,
      for_sale,
    });
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
