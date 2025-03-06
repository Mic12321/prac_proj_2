const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Database & tables has been created!");
  })
  .catch((err) => {
    console.error("Unable to connect to the database or sync tables:", err);
  });

if (process.env.NODE_ENV === "development") {
  app.use(cors());
}

app.use(express.json());

require("./startup/routes")(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
