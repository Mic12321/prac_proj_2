const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = require("./User");
const Orders = require("./Orders");
const OrderItems = require("./OrderItems");
const Item = require("./Item");
const PointsRecord = require("./PointsRecord");
const Ingredient = require("./Ingredient");
const Category = require("./Category");
const ShoppingCartItems = require("./ShoppingCartItems");

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

User.hasMany(ShoppingCartItems, { foreignKey: "user_id", onDelete: "CASCADE" });
ShoppingCartItems.belongsTo(User, { foreignKey: "user_id" });

Item.hasMany(ShoppingCartItems, { foreignKey: "item_id", onDelete: "CASCADE" });
ShoppingCartItems.belongsTo(Item, { foreignKey: "item_id" });

Item.belongsToMany(Item, {
  through: Ingredient,
  as: "Ingredients",
  foreignKey: "item_to_create_id",
  otherKey: "ingredient_item_id",
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
  ShoppingCartItems,
};
