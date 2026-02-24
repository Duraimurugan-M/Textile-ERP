import express from "express";
import {
  createVendor,
  getVendors,
  deleteAllVendors,
} from "../controllers/vendorController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createVendor);
router.get("/", authMiddleware, getVendors);
router.delete("/delete-all", authMiddleware, deleteAllVendors); // dev only

export default router;