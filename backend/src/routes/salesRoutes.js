import express from "express";
import { createSale, getSales } from "../controllers/salesController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getSales);

router.post(
  "/",
  authMiddleware,
  checkPermission("sales", "create"),
  createSale
);

export default router;
