const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.sendStatus(403);
  next();
}

function requireAdminOrStaff(req, res, next) {
  if (req.user?.role === "admin" || req.user?.role === "staff") {
    return next();
  }
  return res.sendStatus(403);
}

module.exports = { authenticateToken, requireAdmin, requireAdminOrStaff };
