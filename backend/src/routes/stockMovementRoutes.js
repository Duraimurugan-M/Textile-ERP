import express from "express";
import StockMovement from "../models/StockMovement.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      module,
      movementType,
      lotNumber,
      startDate,
      endDate,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    // 🔎 Filtering
    if (module) query.module = module;
    if (movementType) query.movementType = movementType;
    if (lotNumber) query.lotNumber = lotNumber;

    // 📅 Date filtering
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // 🔽 Sorting
    const sortOption = {};
    sortOption[sortBy] = order === "asc" ? 1 : -1;

    const total = await StockMovement.countDocuments(query);

    const movements = await StockMovement.find(query)
      .populate("performedBy", "name")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: movements.map((item) => ({
        ...item._doc,
        date: item.createdAt.toLocaleDateString(),
        time: item.createdAt.toLocaleTimeString(),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;