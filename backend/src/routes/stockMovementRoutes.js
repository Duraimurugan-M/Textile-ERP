import express from "express";
import StockMovement from "../models/StockMovement.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const movements = await StockMovement.find()
      .populate("performedBy", "name")
      .sort({ createdAt: -1 });

    const formatted = movements.map((item) => ({
      ...item._doc,
      date: item.createdAt.toLocaleDateString(),
      time: item.createdAt.toLocaleTimeString(),
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;