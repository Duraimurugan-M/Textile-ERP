import express from "express";
import {
  createPurchase,
  getPurchases,
} from "../controllers/purchaseController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPurchases);

router.post(
  "/",
  authMiddleware,
  checkPermission("purchase", "create"),
  createPurchase
);

export default router;
