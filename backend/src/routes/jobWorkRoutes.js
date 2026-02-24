import express from "express";
import {
  sendToJobWork,
  receiveFromJobWork,
  getJobWorks,
  deleteJobWork,
} from "../controllers/jobWorkController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authMiddleware, sendToJobWork);
router.post("/receive", authMiddleware, receiveFromJobWork);
router.get("/", authMiddleware, getJobWorks);
router.delete("/:id", authMiddleware, deleteJobWork); // Dev Only

export default router;