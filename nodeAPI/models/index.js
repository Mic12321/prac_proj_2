const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = require("./User");
const Orders = require("./Orders");
const OrderItems = require("./OrderItems");
const Item = require("./Item");
const PointsRecord = require("./PointsRecord");
const Ingredient = require("./Ingredient");
const Category = require("./Category");
const ShoppingCartItem = require("./ShoppingCartItem");

User.hasMany(Orders, { foreignKey: "user_id" });
Orders.belongsTo(User, { foreignKey: "user_id" });

Orders.hasMany(OrderItems, { foreignKey: "order_id" });
OrderItems.belongsTo(Orders, { foreignKey: "order_id" });

Item.hasMany(OrderItems, { foreignKey: "item_id" });
OrderItems.belongsTo(Item, { foreignKey: "item_id" });

Category.hasMany(Item, { foreignKey: "category_id" });
Item.belongsTo(Category, { foreignKey: "category_id" });

User.hasMany(PointsRecord, { foreignKey: "user_id" });
PointsRecord.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(ShoppingCartItem, { foreignKey: "user_id", onDelete: "CASCADE" });
ShoppingCartItem.belongsTo(User, { foreignKey: "user_id" });

Item.hasMany(ShoppingCartItem, { foreignKey: "item_id", onDelete: "CASCADE" });
ShoppingCartItem.belongsTo(Item, { foreignKey: "item_id" });

Item.belongsToMany(Item, {
  through: Ingredient,
  as: "Ingredients",
  foreignKey: "item_to_create_id",
  otherKey: "ingredient_item_id",
});

Ingredient.belongsTo(Item, {
  foreignKey: "ingredient_item_id",
  as: "ingredientItem",
});

Ingredient.belongsTo(Item, {
  foreignKey: "item_to_create_id",
  as: "itemToCreate",
});

Item.addHook("afterCreate", async (item, options) => {
  await Category.increment("linked_item_quantity", {
    by: 1,
    where: { category_id: item.category_id },
  });
});

Item.addHook("afterDestroy", async (item, options) => {
  await Category.decrement("linked_item_quantity", {
    by: 1,
    where: { category_id: item.category_id },
  });
});

Item.addHook("afterUpdate", async (item, options) => {
  if (item._previousDataValues.category_id !== item.category_id) {
    await Category.decrement("linked_item_quantity", {
      by: 1,
      where: { category_id: item._previousDataValues.category_id },
    });
    await Category.increment("linked_item_quantity", {
      by: 1,
      where: { category_id: item.category_id },
    });
  }
});

module.exports = {
  sequelize,
  User,
  Orders,
  OrderItems,
  Item,
  PointsRecord,
  Ingredient,
  Category,
  ShoppingCartItem,
};
