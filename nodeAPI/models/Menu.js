const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Menu = sequelize.define(
  "Menu",
  {
    menu_id: {
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
  },
  {
    tableName: "menu",
    timestamps: false,
  }
);

module.exports = Menu;
