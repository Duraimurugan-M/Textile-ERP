import Production from "../models/Production.js";
import { addStock, deductStock } from "../services/inventoryService.js";
import Inventory from "../models/Inventory.js";

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

    if (
      !inputMaterialType ||
      !inputLotNumber ||
      !outputMaterialType ||
      !outputLotNumber
    )
      return res.status(400).json({ message: "All fields required" });

    if (Number(inputQuantity) <= 0 || Number(outputQuantity) <= 0)
      return res.status(400).json({ message: "Quantity must be greater than 0" });

    // 🔒 Output lot must NOT exist
    const existingOutputLot = await Inventory.findOne({ lotNumber: outputLotNumber });
    if (existingOutputLot)
      return res.status(400).json({ message: "Output lot already exists" });

    // 🔒 Deduct input stock
    const deductedStock = await deductStock({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
      quantity: Number(inputQuantity),
    });

    if (!deductedStock)
      return res.status(400).json({ message: "Insufficient stock" });

    const production = await Production.create({
      inputMaterialType,
      inputLotNumber,
      inputQuantity,
      outputMaterialType,
      outputLotNumber,
      outputQuantity,
      status: "Completed",
      createdBy: req.user._id,
    });

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
      message: "Production completed",
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