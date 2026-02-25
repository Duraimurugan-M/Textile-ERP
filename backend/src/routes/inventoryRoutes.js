import express from "express";
import {
  addStock,
  getInventory,
} from "../controllers/inventoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* ==========================================
   ADD STOCK (Purchase Entry)
========================================== */
router.post(
  "/",
  authMiddleware,
  checkPermission("inventory", "edit"),
  addStock
);

/* ==========================================
   GET AVAILABLE INVENTORY
========================================== */
router.get(
  "/",
  authMiddleware,
  checkPermission("inventory", "view"),
  getInventory
);

export default router;