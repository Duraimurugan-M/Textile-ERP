import express from "express";
import StockMovement from "../models/StockMovement.js";
import authMiddleware from "../middleware/authMiddleware.js";
import QueryFeatures from "../utils/queryFeatures.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const totalRecords = await StockMovement.countDocuments();

    const features = new QueryFeatures(StockMovement, req.query)
      .filter()
      .search(["lotNumber"])
      .sort()
      .paginate();

    const movements = await features.query
      .populate("performedBy", "name");

    res.json({
      success: true,
      data: movements,
      currentPage: features.page,
      totalPages: Math.ceil(totalRecords / features.limit),
      totalRecords,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;