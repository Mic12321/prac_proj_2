const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    const categorys = await Category.findAll();
    res.json(categorys);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categorys" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Error fetching category" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { category_name, category_description } = req.body;

    const existingCategory = await Category.findOne({
      where: { category_name },
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Category with this name already exists" });
    }

    const newCategory = await Category.create({
      category_name,
      category_description,
      linked_item_quantity: 0,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Error creating Category" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { category_name, category_description } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const existingCategory = await Category.findOne({
      where: { category_name, category_id: { [Op.ne]: id } },
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Category with this name already exists" });
    }

    const updated = await Category.update(
      { category_name, category_description },
      { where: { category_id: req.params.id } }
    );

    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating Category" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.linked_item_quantity > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete category with linked items" });
    }

    await category.destroy();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Category" });
  }
});

module.exports = router;
