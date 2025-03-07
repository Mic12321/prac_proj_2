const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

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
    const newCategory = await Category.create({
      category_name,
      category_description,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Error creating Category" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { category_name, category_description } = req.body;
    const updated = await Category.update(
      { category_name, category_description },
      { where: { category_id: req.params.id } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating Category" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.destroy({
      where: { category_id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Category" });
  }
});

module.exports = router;
