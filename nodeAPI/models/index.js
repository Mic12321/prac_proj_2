const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = require("./User");
const Orders = require("./Orders");
const OrderItems = require("./OrderItems");
const Item = require("./Item");
const PointsRecord = require("./PointsRecord");
const Ingredient = require("./Ingredient");
const Menu = require("./Menu");

User.hasMany(Orders, { foreignKey: "user_id" });
Orders.belongsTo(User, { foreignKey: "user_id" });

Orders.hasMany(OrderItems, { foreignKey: "order_id" });
OrderItems.belongsTo(Orders, { foreignKey: "order_id" });

Item.hasMany(OrderItems, { foreignKey: "item_id" });
OrderItems.belongsTo(Item, { foreignKey: "item_id" });

Menu.hasMany(Item, { foreignKey: "menu_category_id" });
Item.belongsTo(Menu, { foreignKey: "menu_category_id" });

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
  Menu,
};
