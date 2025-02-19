const express = require("express");

const userRoutes = require("../routes/users");
const orderRoutes = require("../routes/orders");
const itemRoutes = require("../routes/items");

module.exports = function (app) {
  app.use(express.json());

  app.use("/users", userRoutes);
  app.use("/orders", orderRoutes);
  app.use("/items", itemRoutes);
};
