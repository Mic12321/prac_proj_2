const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");

router.get("/", async (req, res) => {
  try {
    const menus = await Menu.findAll();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: "Error fetching menus" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Error fetching menu" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { category_name, category_description } = req.body;
    const newMenu = await Menu.create({ category_name, category_description });
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ error: "Error creating menu" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { category_name, category_description } = req.body;
    const updated = await Menu.update(
      { category_name, category_description },
      { where: { menu_id: req.params.id } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json({ message: "Menu updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating menu" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Menu.destroy({ where: { menu_id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json({ message: "Menu deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting menu" });
  }
});

module.exports = router;
