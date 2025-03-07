const express = require("express");

const userRoutes = require("../routes/users");
const orderRoutes = require("../routes/orders");
const itemRoutes = require("../routes/items");
const categoryRoutes = require("../routes/category");

module.exports = function (app) {
  app.use(express.json());

  app.use("/api/users", userRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/items", itemRoutes);
  app.use("/api/category", categoryRoutes);
};
