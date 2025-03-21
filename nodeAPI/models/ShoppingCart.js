const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ShoppingCart = sequelize.define(
  "ShoppingCart",
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
    tableName: "shopping_cart",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "item_id"],
      },
    ],
  }
);

module.exports = ShoppingCart;
