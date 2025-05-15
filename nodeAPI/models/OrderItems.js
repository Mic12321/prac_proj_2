const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const OrderItems = sequelize.define(
  "OrderItems",
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price_at_purchase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["order_id", "item_id"],
      },
    ],
  }
);

module.exports = OrderItems;
