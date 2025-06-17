const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const app = express();
require("dotenv").config();
require("./utils/redisClient");
const { ensureAdminExists } = require("./utils/ensureAdmin");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync();
    console.log("Database & tables have been created!");

    await ensureAdminExists();

    if (process.env.NODE_ENV === "development") {
      app.use(cors());
    }

    app.use(express.json());
    require("./startup/routes")(app);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
