const express = require("express");
const router = express.Router();
const Ingredient = require("../models/Ingredient");
const Item = require("../models/Item");
const Category = require("../models/Category");
const { Op } = require("sequelize");

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

router.get("/available/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const linkedIngredients = await Ingredient.findAll({
      where: { item_to_create_id: itemId },
      attributes: ["ingredient_item_id"],
    });

    const linkedIds = linkedIngredients.map((i) => i.ingredient_item_id);

    const availableItems = await Item.findAll({
      where: linkedIds.length
        ? {
            item_id: {
              [Op.notIn]: [...linkedIds, itemId],
            },
          }
        : {},
    });

    res.json(availableItems);
  } catch (error) {
    res.status(500).json({ error: "Error fetching available items" });
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

router.post("/", async (req, res) => {
  const { itemToCreateId, ingredientItemId, quantity } = req.body;

  if (!itemToCreateId || !ingredientItemId || !quantity) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const newIngredient = await Ingredient.create({
      item_to_create_id: itemToCreateId,
      ingredient_item_id: ingredientItemId,
      quantity,
    });

    res.status(201).json(newIngredient);
  } catch (error) {
    console.error("Error creating ingredient:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
