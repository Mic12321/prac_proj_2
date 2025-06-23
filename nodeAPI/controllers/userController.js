const { User } = require("../models");
const { Op } = require("sequelize");

async function register(req, res) {
  try {
    const { username, password, role } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username and password are required" });

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser)
      return res.status(409).json({ error: "Username already taken" });

    const newUser = await User.create({
      username,
      password,
      role: role || "client",
      total_points: 0,
    });

    const userData = newUser.toJSON();
    delete userData.password;

    res
      .status(201)
      .json({ message: "User registered successfully", user: userData });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { username, password, role, total_points, last_login } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (username !== undefined) user.username = username;
    if (password !== undefined) user.password = password;
    if (role !== undefined) user.role = role;
    if (total_points !== undefined) user.total_points = total_points;
    if (last_login !== undefined) user.last_login = last_login;

    await user.save();

    const updatedUser = user.toJSON();
    delete updatedUser.password;

    res.json({ message: "User updated", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: [
        "user_id",
        "username",
        "account_creation",
        "last_login",
        "total_points",
        "role",
        "suspended",
      ],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

async function suspendUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role === "admin") {
      const activeAdmins = await User.count({
        where: {
          role: "admin",
          suspended: false,
          user_id: { [Op.ne]: user.user_id },
        },
      });

      if (activeAdmins === 0) {
        return res.status(400).json({
          error: "Cannot suspend the last active admin",
        });
      }
    }

    user.suspended = true;
    await user.save();

    res.json({ message: "User suspended successfully." });
  } catch (err) {
    console.error("Suspend error:", err);
    res.status(500).json({ error: "Failed to suspend user." });
  }
}

async function restoreUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.suspended = false;
    await user.save();

    res.json({ message: "User restored successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to restore user." });
  }
}

module.exports = {
  register,
  updateUser,
  deleteUser,
  getAllUsers,
  suspendUser,
  restoreUser,
};
