import Inventory from "../models/Inventory.js";
import { addStock, deductStock } from "../services/inventoryService.js";
import QueryFeatures from "../utils/queryFeatures.js";

/* =====================================================
   ➕ ADD STOCK
===================================================== */
export const createStock = async (req, res) => {
  try {
    const stock = await addStock({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: stock,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   📦 GET INVENTORY (AVAILABLE ONLY)
===================================================== */
export const getInventory = async (req, res) => {
  try {
    const baseQuery = Inventory.find({ status: "Available" });

    const totalRecords = await Inventory.countDocuments({
      status: "Available",
    });

    const features = new QueryFeatures(baseQuery, req.query)
      .filter()
      .search(["lotNumber"])
      .sort()
      .paginate();

    const inventory = await features.query;

    res.json({
      success: true,
      data: inventory,
      currentPage: features.page,
      totalPages: Math.ceil(totalRecords / features.limit),
      totalRecords,
    });
  } catch (error) {
    console.error("Inventory Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   ➖ CONSUME STOCK
===================================================== */
export const consumeStock = async (req, res) => {
  try {
    const { materialType, lotNumber, quantity } = req.body;

    if (!materialType || !lotNumber || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const stock = await Inventory.findOne({
      materialType,
      lotNumber,
    });

    if (!stock) {
      return res.status(400).json({ message: "Stock not found" });
    }

    if (stock.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Insufficient stock quantity" });
    }

    stock.quantity -= quantity;

    // If quantity becomes 0 → mark as Consumed
    if (stock.quantity === 0) {
      stock.status = "Consumed";
    }

    await stock.save();

    res.status(200).json({
      success: true,
      message: "Stock consumed successfully",
      data: stock,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =====================================================
   🧹 DELETE ALL STOCK (DEV ONLY)
===================================================== */
export const deleteAllStock = async (req, res) => {
  try {
    await Inventory.deleteMany();
    res.status(200).json({
      success: true,
      message: "All stock deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};