import express from "express";
import { createQC, getQCList } from "../controllers/qcController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getQCList);

router.post(
  "/",
  authMiddleware,
  checkPermission("qc", "approve"),
  createQC
);

export default router;