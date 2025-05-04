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

router.put("/", async (req, res) => {
  const { itemToCreateId, ingredientItemId, quantity } = req.body;

  if (
    typeof itemToCreateId !== "number" ||
    typeof ingredientItemId !== "number" ||
    typeof quantity !== "number"
  ) {
    return res.status(400).json({ error: "Invalid or missing fields." });
  }

  try {
    const ingredient = await Ingredient.findOne({
      where: {
        item_to_create_id: itemToCreateId,
        ingredient_item_id: ingredientItemId,
      },
    });

    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found." });
    }

    ingredient.quantity = quantity;
    ingredient.last_updatetime = new Date();
    await ingredient.save();

    res.json(ingredient);
  } catch (error) {
    console.error("Error updating ingredient:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/", async (req, res) => {
  const { itemToCreateId, ingredientItemId } = req.body;

  if (
    typeof itemToCreateId !== "number" ||
    typeof ingredientItemId !== "number"
  ) {
    return res.status(400).json({ error: "Invalid or missing fields." });
  }

  try {
    const deletedCount = await Ingredient.destroy({
      where: {
        item_to_create_id: itemToCreateId,
        ingredient_item_id: ingredientItemId,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Ingredient not found." });
    }

    res.json({ message: "Ingredient deleted successfully." });
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
