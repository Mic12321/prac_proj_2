const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const PointsRecord = sequelize.define(
  "PointsRecord",
  {
    points_record_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    reasons: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "points_record",
    timestamps: false,
  }
);

module.exports = PointsRecord;
