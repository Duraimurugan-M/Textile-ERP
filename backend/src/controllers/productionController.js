import Production from "../models/Production.js";
import { addStock, deductStock } from "../services/inventoryService.js";
import StockMovement from "../models/StockMovement.js";
import Inventory from "../models/Inventory.js";

// ✅ Create Production
export const createProduction = async (req, res) => {
  try {
    const {
      inputMaterialType,
      inputLotNumber,
      inputQuantity,
      outputMaterialType,
      outputLotNumber,
      outputQuantity,
    } = req.body;

    // 🔹 Basic Validation
    if (
      !inputMaterialType ||
      !inputLotNumber ||
      !outputMaterialType ||
      !outputLotNumber
    ) {
      return res.status(400).json({ message: "All fields required" });
    }

    const inputQty = Number(inputQuantity);
    const outputQty = Number(outputQuantity);

    if (inputQty <= 0 || outputQty <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    if (outputQty > inputQty) {
      return res.status(400).json({
        message: "Output quantity cannot be greater than input quantity",
      });
    }

    // 🔒 Output lot must NOT exist
    const existingOutputLot = await Inventory.findOne({
      lotNumber: outputLotNumber,
    });

    if (existingOutputLot) {
      return res.status(400).json({
        message: "Output lot already exists",
      });
    }

    // 🔒 Check input stock before deduction
    const inputStockBefore = await Inventory.findOne({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
    });

    if (!inputStockBefore) {
      return res.status(400).json({
        message: "Input lot not found in inventory",
      });
    }

    if (inputStockBefore.quantity < inputQty) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${inputStockBefore.quantity}`,
      });
    }

    // 🔻 Deduct input stock
    await deductStock({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
      quantity: inputQty,
    });

    // Get stock after deduction
    const inputStockAfter = await Inventory.findOne({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
    });

    // ✅ Create Production Record
    const production = await Production.create({
      inputMaterialType,
      inputLotNumber,
      inputQuantity: inputQty,
      outputMaterialType,
      outputLotNumber,
      outputQuantity: outputQty,
      status: "Completed",
      createdBy: req.user._id,
    });

    // 📘 Ledger ENTRY (INPUT OUT)
    await StockMovement.create({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
      movementType: "OUT",
      module: "Production",
      quantity: inputQty,
      previousStock: inputStockBefore.quantity,
      newStock: inputStockAfter.quantity,
      referenceId: production._id,
      performedBy: req.user._id,
    });

    // 🔼 Add Output Stock
    await addStock({
      materialType: outputMaterialType,
      lotNumber: outputLotNumber,
      quantity: outputQty,
      unit: inputStockBefore.unit,
      location: "Production Warehouse",
      createdBy: req.user._id,
    });

    const outputStockAfter = await Inventory.findOne({
      materialType: outputMaterialType,
      lotNumber: outputLotNumber,
    });

    // 📘 Ledger ENTRY (OUTPUT IN)
    await StockMovement.create({
      materialType: outputMaterialType,
      lotNumber: outputLotNumber,
      movementType: "IN",
      module: "Production",
      quantity: outputQty,
      previousStock: 0,
      newStock: outputStockAfter.quantity,
      referenceId: production._id,
      performedBy: req.user._id,
    });

    // ✅ Final Response
    res.status(201).json({
      success: true,
      message: "Production completed successfully",
      data: production,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Productions
export const getProductions = async (req, res) => {
  try {
    const productions = await Production.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: productions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete All (Testing Only)
export const deleteAllProductions = async (req, res) => {
  try {
    await Production.deleteMany();
    res.status(200).json({
      success: true,
      message: "All productions deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};