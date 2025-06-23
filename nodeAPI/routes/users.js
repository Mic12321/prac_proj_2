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
  suspendUser,
  restoreUser,
} = require("../controllers/userController");

router.post("/register", authenticateToken, requireAdmin, register);
router.put("/:id", authenticateToken, requireAdmin, updateUser);
router.put("/:id/suspend", authenticateToken, requireAdmin, suspendUser);
router.put("/:id/restore", authenticateToken, requireAdmin, restoreUser);
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);
router.get("/", authenticateToken, requireAdmin, getAllUsers);

module.exports = router;
