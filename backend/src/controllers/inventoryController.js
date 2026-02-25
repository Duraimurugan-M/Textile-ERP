import Inventory from "../models/Inventory.js";
import StockMovement from "../models/StockMovement.js";

/* =====================================================
   ➕ ADD STOCK (Purchase Entry)
===================================================== */
export const addStock = async (req, res) => {
  try {
    const { materialType, lotNumber, quantity, unit, location } = req.body;

    if (!materialType || !lotNumber || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingLot = await Inventory.findOne({ lotNumber });

    if (existingLot) {
      return res.status(400).json({ message: "Lot already exists" });
    }

    const newStock = await Inventory.create({
      materialType,
      lotNumber,
      quantity,
      unit,
      location,
      status: "Available",
      createdBy: req.user._id,
    });

    await StockMovement.create({
      materialType,
      lotNumber,
      movementType: "IN",
      module: "Purchase",
      quantity,
      previousStock: 0,
      newStock: quantity,
      performedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: newStock,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   📦 GET AVAILABLE INVENTORY ONLY
===================================================== */
export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({ status: "Available" });

    res.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};