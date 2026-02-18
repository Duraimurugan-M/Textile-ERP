import express from "express";
import { createPurchase } from "../controllers/purchaseController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("purchase", "create"),
  createPurchase
);

export default router;
