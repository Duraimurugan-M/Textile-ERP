import Yarn from "../models/Yarn.js";
import Inventory from "../models/Inventory.js";
import StockMovement from "../models/StockMovement.js";

// 🔹 Create Yarn
// 🔹 Create Yarn
export const createYarn = async (req, res) => {
  try {
    const {
      yarnName,
      count,
      composition,
      shade,
      supplier,
      lotNumber,
      quantity, // we still receive quantity from frontend
      unit,
    } = req.body;

    if (!yarnName || !count || !composition || !lotNumber || !quantity) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingLot = await Yarn.findOne({ lotNumber });
    if (existingLot) {
      return res.status(400).json({ message: "Lot already exists" });
    }

    // ✅ Convert to Number (important)
    const qty = Number(quantity);

    const yarn = await Yarn.create({
      yarnName,
      count,
      composition,
      shade,
      supplier,
      lotNumber,
      totalQuantity: qty,        // ✅ NEW
      quantityAvailable: qty,    // ✅ NEW
      quantityInJobWork: 0,      // ✅ NEW
      unit,
    });

    // 🔹 Also add to Inventory
    await Inventory.create({
      materialType: "RawYarn",
      lotNumber,
      quantity: qty,
      unit,
      location: "Main Warehouse",
      status: "Available",
      createdBy: req.user._id,
    });

    // 🔹 Create Stock Movement Entry
    await StockMovement.create({
      materialType: "RawYarn",
      lotNumber,
      movementType: "IN",
      module: "Yarn",
      quantity: qty,
      previousStock: 0,
      newStock: qty,
      referenceId: yarn._id,
      performedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Yarn created successfully",
      data: yarn,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Yarn
export const getYarns = async (req, res) => {
  try {
    const yarns = await Yarn.find()
      .populate("supplier", "supplierName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: yarns,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delte all yarn records (Dev Only)

export const deleteYarnRecords = async (req, res) => {
  try {
    await Yarn.deleteMany();
    res.json({ success: true, message: "All yarn records deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};