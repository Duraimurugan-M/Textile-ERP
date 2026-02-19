import express from "express";
import {
  createProduction,
  getProductions,
  deleteAllProductions,
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

router.delete(
  "/delete-all",
  authMiddleware,
  checkPermission("production", "edit"),
  deleteAllProductions
);

export default router;
