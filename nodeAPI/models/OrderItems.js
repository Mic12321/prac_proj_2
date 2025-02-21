const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const OrderItems = sequelize.define(
  "OrderItems",
  {
    order_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["order_id", "order_item_id"],
      },
    ],
  }
);

module.exports = OrderItems;
