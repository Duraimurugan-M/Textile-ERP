import express from "express";
import {
  createSupplier,
  getSuppliers,
  deleteSupplier,
} from "../controllers/supplierController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSupplier);
router.get("/", authMiddleware, getSuppliers);
router.delete("/:id", authMiddleware, deleteSupplier);

export default router;