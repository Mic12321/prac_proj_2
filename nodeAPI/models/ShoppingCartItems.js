const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ShoppingCartItems = sequelize.define(
  "ShoppingCartItems",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "shopping_cart_items",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "item_id"],
      },
    ],
  }
);

module.exports = ShoppingCartItems;
