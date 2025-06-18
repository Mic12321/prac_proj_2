const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");
const {
  register,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.post("/register", register);
router.put("/:id", updateUser);
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);

module.exports = router;
