const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify password using instance method
    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Login success - for now just return user info without password
    const userData = user.toJSON();
    delete userData.password;

    res.json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Create user (password will be hashed automatically by hook)
    const newUser = await User.create({
      username,
      password,
      role: role || "client",
      total_points: 0,
    });

    // Don't send password back
    const userData = newUser.toJSON();
    delete userData.password;

    res
      .status(201)
      .json({ message: "User registered successfully", user: userData });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
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
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
