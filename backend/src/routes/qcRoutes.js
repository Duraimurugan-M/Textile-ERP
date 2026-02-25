import express from "express";
import { updateQC } from "../controllers/qcController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* ==========================================
   UPDATE QC (Approve / Reject)
========================================== */
router.post(
  "/",
  authMiddleware,
  checkPermission("qc", "approve"),
  updateQC
);

export default router;