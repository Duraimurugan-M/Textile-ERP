import express from "express";
import { createSale } from "../controllers/salesController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* ==========================================
   CREATE SALE
========================================== */
router.post(
  "/",
  authMiddleware,
  checkPermission("sales", "edit"),
  createSale
);

export default router;