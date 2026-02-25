import express from "express";
import { createProduction } from "../controllers/productionController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* ==========================================
   CREATE PRODUCTION
========================================== */
router.post(
  "/",
  authMiddleware,
  checkPermission("production", "edit"),
  createProduction
);

export default router;