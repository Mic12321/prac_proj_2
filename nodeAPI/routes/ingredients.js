const express = require("express");
const router = express.Router();
const Ingredient = require("../models/Ingredient");
const Item = require("../models/Item");

router.get("/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const ingredients = await Ingredient.findAll({
      where: { item_to_create_id: itemId },
      include: [{ model: Item, as: "ingredientItem" }],
    });

    res.json(ingredients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
