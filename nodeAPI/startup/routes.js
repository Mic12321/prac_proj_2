const express = require("express");

const userRoutes = require("../routes/users");
const orderRoutes = require("../routes/orders");
const itemRoutes = require("../routes/items");
const categoryRoutes = require("../routes/category");
const shoppingCartItemsRoutes = require("../routes/shoppingCartItems");
const ingredientRoutes = require("../routes/ingredients");
const checkoutRoutes = require("../routes/checkout");
const authRoutes = require("../routes/auth");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/items", itemRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/shopping-cart-items", shoppingCartItemsRoutes);
  app.use("/api/ingredients", ingredientRoutes);
  app.use("/api/checkout", checkoutRoutes);
};
