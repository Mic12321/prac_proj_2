const Item = require("../models/Item");
const Category = require("../models/Category");
const { Op } = require("sequelize");

async function getAllItems(req, res) {
  try {
    const items = await Item.findAll({
      include: [{ model: Category }],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getItemsForSale(req, res) {
  try {
    const itemsForSale = await Item.findAll({
      where: { for_sale: true },
      include: [{ model: Category }],
    });
    res.json(itemsForSale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getItemsByCategory(req, res) {
  const { categoryId } = req.params;

  try {
    const items = await Item.findAll({
      where: { category_id: categoryId },
      include: [{ model: Category }],
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getItemById(req, res) {
  const { id } = req.params;

  try {
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function createNewItem(req, res) {
  const {
    item_name,
    item_description,
    stock_quantity,
    unit_name,
    low_stock_quantity,
    price,
    category_id,
    for_sale,
  } = req.body;

  try {
    const existingItem = await Item.findOne({ where: { item_name } });

    if (existingItem)
      return res
        .status(400)
        .json({ error: "Item with this name already exists" });

    const newItem = await Item.create({
      item_name,
      item_description,
      stock_quantity,
      unit_name,
      low_stock_quantity,
      price,
      category_id,
      for_sale,
    });

    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateItem(req, res) {
  const { id } = req.params;
  const {
    item_name,
    item_description,
    stock_quantity,
    unit_name,
    low_stock_quantity,
    price,
    category_id,
    for_sale,
  } = req.body;

  try {
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const existingItem = await Item.findOne({
      where: { item_name, item_id: { [Op.ne]: id } },
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ error: "Item with this name already exists" });
    }

    const updatedItem = await item.update({
      item_name,
      item_description,
      stock_quantity,
      unit_name,
      low_stock_quantity,
      price,
      category_id,
      for_sale,
    });

    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteItem(req, res) {
  const { id } = req.params;

  try {
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    await item.destroy();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllItems,
  getItemsForSale,
  getItemsByCategory,
  getItemById,
  createNewItem,
  updateItem,
  deleteItem,
};
