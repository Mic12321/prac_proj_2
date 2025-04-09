const express = require("express");
const router = express.Router();
const Ingredient = require("../models/Ingredient");
const Item = require("../models/Item");

router.get("/used-in/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const itemsUsingThisIngredient = await Ingredient.findAll({
      where: { ingredient_item_id: itemId },
      include: [{ model: Item, as: "itemToCreate" }],
    });

    res.json(itemsUsingThisIngredient);
  } catch (error) {
    console.error("Error fetching items using this ingredient:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const ingredients = await Ingredient.findAll({
      where: { item_to_create_id: itemId },
      include: [{ model: Item, as: "ingredientItem" }],
    });

    res.json(ingredients);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
