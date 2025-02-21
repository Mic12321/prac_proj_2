const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Orders = sequelize.define(
  "Orders",
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ordertime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    last_updatetime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

module.exports = Orders;
