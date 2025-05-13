const express = require("express");
const router = express.Router();
const Ingredient = require("../models/Ingredient");
const Item = require("../models/Item");
const Category = require("../models/Category");
const { Op } = require("sequelize");

async function buildGraph() {
  const ingredients = await Ingredient.findAll({ raw: true });
  const graph = new Map();

  for (const ing of ingredients) {
    const from = ing.item_to_create_id;
    const to = ing.ingredient_item_id;

    if (!graph.has(from)) graph.set(from, []);
    graph.get(from).push(to);
  }

  return graph;
}

function hasCycle(graph, itemToCreateId, ingredientItemId) {
  if (itemToCreateId === ingredientItemId) return true;

  const visited = new Set();
  const stack = [ingredientItemId];

  while (stack.length) {
    const current = stack.pop();
    if (current === itemToCreateId) return true;

    if (visited.has(current)) continue;
    visited.add(current);

    const neighbors = graph.get(current) || [];
    for (const neighbor of neighbors) {
      stack.push(neighbor);
    }
  }

  return false;
}

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
  const itemId = parseInt(req.params.itemId);

  try {
    const graph = await buildGraph();

    const linkedIngredients = await Ingredient.findAll({
      where: { item_to_create_id: itemId },
      attributes: ["ingredient_item_id"],
      raw: true,
    });

    const linkedIds = linkedIngredients.map((i) => i.ingredient_item_id);

    const potentialItems = await Item.findAll({
      where: {
        item_id: {
          [Op.notIn]: [...linkedIds, itemId],
        },
      },
    });

    const safeItems = potentialItems.filter((item) => {
      return !hasCycle(graph, itemId, item.item_id);
    });

    res.json(safeItems);
  } catch (error) {
    console.error("Error in /available/:itemId:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/available-items/:ingredientId", async (req, res) => {
  const ingredientId = parseInt(req.params.ingredientId);

  try {
    const graph = await buildGraph();

    const linkedItems = await Ingredient.findAll({
      where: { ingredient_item_id: ingredientId },
      attributes: ["item_to_create_id"],
      raw: true,
    });

    const linkedIds = linkedItems.map((i) => i.item_to_create_id);

    const potentialItems = await Item.findAll({
      where: {
        item_id: {
          [Op.notIn]: linkedIds,
        },
      },
    });

    const safeItems = potentialItems.filter((item) => {
      return !hasCycle(graph, item.item_id, ingredientId);
    });

    res.json(safeItems);
  } catch (error) {
    console.error("Error in /available-items/:ingredientId:", error);
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

router.post("/", async (req, res) => {
  const { itemToCreateId, ingredientItemId, quantity } = req.body;

  if (!itemToCreateId || !ingredientItemId || !quantity) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const graph = await buildGraph();
    if (hasCycle(graph, itemToCreateId, ingredientItemId)) {
      return res.status(400).json({ error: "Circular dependency detected." });
    }

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
