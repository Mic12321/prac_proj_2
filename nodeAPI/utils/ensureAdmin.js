const User = require("../models/User");

async function ensureAdminExists() {
  const adminExists = await User.findOne({ where: { role: "admin" } });
  if (!adminExists) {
    await User.create({
      username: "admin",
      password: "admin",
      role: "admin",
      total_points: 0,
    });
    console.log("Admin user created");
  }
}

module.exports = { ensureAdminExists };
