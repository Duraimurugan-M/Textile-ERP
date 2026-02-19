import Production from "../models/Production.js";
import { addStock, deductStock } from "../services/inventoryService.js";

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

    // 🔒 Basic validation
    if (
      !inputMaterialType ||
      !inputLotNumber ||
      !inputQuantity ||
      !outputMaterialType ||
      !outputLotNumber ||
      !outputQuantity
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (Number(outputQuantity) > Number(inputQuantity)) {
      return res.status(400).json({
        message: "Output quantity cannot be greater than input quantity",
      });
    }

    // 1️⃣ Deduct input stock
    const deductedStock = await deductStock({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
      quantity: Number(inputQuantity),
    });

    // 2️⃣ Create production record
    const production = await Production.create({
      inputMaterialType,
      inputLotNumber,
      inputQuantity: Number(inputQuantity),
      outputMaterialType,
      outputLotNumber,
      outputQuantity: Number(outputQuantity),
      status: "Completed",
      createdBy: req.user._id,
    });

    // 3️⃣ Add output stock
    await addStock({
      materialType: outputMaterialType,
      lotNumber: outputLotNumber,
      quantity: Number(outputQuantity),
      unit: deductedStock.unit,
      location: "Production Warehouse",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Production completed successfully",
      data: production,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

// Delete all productions (For Development/Testing)
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