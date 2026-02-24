import express from "express";
import { createYarn, deleteYarnRecords, getYarns } from "../controllers/yarnController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createYarn);
router.get("/", authMiddleware, getYarns);
router.delete("/delete-all", authMiddleware, deleteYarnRecords);

export default router;