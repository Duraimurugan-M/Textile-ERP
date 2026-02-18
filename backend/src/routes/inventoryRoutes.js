import express from "express";
import {
  createStock,
  fetchAllStock,
  consumeStock,
} from "../controllers/inventoryController.js";

import  authMiddleware  from "../middleware/authMiddleware.js";
import  checkPermission  from "../middleware/permissionMiddleware.js";

const router = express.Router();

// Add stock (Store In-Charge or Purchase Manager)
router.post(
  "/",
  authMiddleware,
  checkPermission("inventory", "edit"),
  createStock
);

// View stock
router.get(
  "/",
  authMiddleware,
  checkPermission("inventory", "view"),
  fetchAllStock
);

// Reduce stock (used in production later)
router.put(
  "/:id/reduce",
  authMiddleware,
  checkPermission("inventory", "edit"),
  consumeStock
);

export default router;
