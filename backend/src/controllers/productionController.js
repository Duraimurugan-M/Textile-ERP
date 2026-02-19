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

    // 🔒 Validation: Prevent production gain
    if (outputQuantity > inputQuantity) {
      return res.status(400).json({
        message: "Output quantity cannot be greater than input quantity",
      });
    }

    // 1️⃣ Deduct input stock using service
    const deductedStock = await deductStock({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
      quantity: inputQuantity,
    });

    // 2️⃣ Create production record
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

    // 3️⃣ Add finished goods to inventory
    await addStock({
      materialType: outputMaterialType,
      lotNumber: outputLotNumber,
      quantity: outputQuantity,
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
