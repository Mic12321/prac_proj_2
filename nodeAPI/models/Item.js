const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Item = sequelize.define(
  "Item",
  {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    item_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    item_description: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    stock_quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    unit_name: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    last_updatetime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    low_stock_quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    picture: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
  },
  {
    tableName: "item",
    timestamps: false,
  }
);

module.exports = Item;
