const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  requireAdmin,
  requireAdminOrStaff,
} = require("../middlewares/authMiddleware");
const {
  getAllItems,
  getItemsForSale,
  getItemsByCategory,
  getItemById,
  createNewItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

router.get("/", authenticateToken, getAllItems);
router.get("/for-sale", authenticateToken, getItemsForSale);
router.get("/by-category/:categoryId", authenticateToken, getItemsByCategory);
router.get("/:id", authenticateToken, getItemById);
router.post("/", authenticateToken, requireAdminOrStaff, createNewItem);
router.put("/:id", authenticateToken, requireAdminOrStaff, updateItem);
router.delete("/:id", authenticateToken, requireAdminOrStaff, deleteItem);

module.exports = router;
