import express from "express";
import {
  createProduction,
  getProductions,
} from "../controllers/productionController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProductions);

router.post(
  "/",
  authMiddleware,
  checkPermission("production", "create"),
  createProduction
);

export default router;
