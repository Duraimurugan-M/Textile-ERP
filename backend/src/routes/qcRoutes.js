import express from "express";
import { updateQC, deleteQCRecords, getQCRecords } from "../controllers/qcController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getQCRecords);

router.post(
  "/",
  authMiddleware,
  checkPermission("qc", "approve"),
  updateQC
);

router.delete("/delete-all", authMiddleware, checkPermission("qc", "approve"), deleteQCRecords);

export default router;