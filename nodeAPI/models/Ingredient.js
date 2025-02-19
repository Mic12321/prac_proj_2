const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Ingredient = sequelize.define(
  "Ingredient",
  {
    item_to_create_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    ingredient_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    last_updatetime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ingredient",
    timestamps: false,
  }
);

module.exports = Ingredient;
