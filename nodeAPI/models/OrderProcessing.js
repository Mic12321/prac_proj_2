const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const OrderProcessing = sequelize.define(
  "OrderProcessing",
  {
    order_processing_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("picked", "in_progress", "completed"),
      defaultValue: "picked",
    },
    picked_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "order_processing",
    timestamps: false,
  }
);

module.exports = OrderProcessing;
