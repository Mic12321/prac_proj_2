const { User } = require("../models");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateUserTokens");

async function refreshToken(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(payload.user_id);

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);

    return res.json({ token: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password (assuming verifyPassword is defined on User model)
    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWTs
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Return user info (excluding password) and tokens
    return res.json({
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
      token: accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  login,
  refreshToken,
};
