const { User } = require("../models");

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

module.exports = {
  register,
  updateUser,
  deleteUser,
};
