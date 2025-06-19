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
  getAllUsers,
} = require("../controllers/userController");

router.post("/register", authenticateToken, requireAdmin, register);
router.put("/:id", authenticateToken, requireAdmin, updateUser);
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);
router.get("/", authenticateToken, requireAdmin, getAllUsers);

module.exports = router;
