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

    // 🔒 Strict stage flow map
    const validFlow = {
      RawYarn: "DyedYarn",
      DyedYarn: "GreyFabric",
      GreyFabric: "FinishedFabric",
    };

    // ❌ FinishedFabric cannot be input
    if (inputMaterialType === "FinishedFabric") {
      return res.status(400).json({
        message: "Finished Fabric cannot be used as input material",
      });
    }

    // ❌ Invalid stage skipping
    if (validFlow[inputMaterialType] !== outputMaterialType) {
      return res.status(400).json({
        message: `Invalid production flow from ${inputMaterialType} to ${outputMaterialType}`,
      });
    }

    if (Number(outputQuantity) > Number(inputQuantity)) {
      return res.status(400).json({
        message: "Output quantity cannot exceed input quantity",
      });
    }

    // Deduct input stock
    const deductedStock = await deductStock({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
      quantity: Number(inputQuantity),
    });

    // Create production record
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

    // Add output stock
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