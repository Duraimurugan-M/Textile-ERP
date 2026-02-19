import express from "express";
import {
  createPurchase,
  deleteAllPurchases,
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

router.delete(
  "/delete-all",
  authMiddleware,
  checkPermission("purchase", "delete"),
  deleteAllPurchases
);

export default router;
