const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false,
    },
    category_description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    linked_item_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "category",
    timestamps: false,
  }
);

module.exports = Category;
