import Production from "../models/Production.js";
import Inventory from "../models/Inventory.js";
import StockMovement from "../models/StockMovement.js";
import QC from "../models/QC.js";

/* =====================================================
   CREATE PRODUCTION
===================================================== */
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

    const inputStock = await Inventory.findOne({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
      status: "Available",
    });

    if (!inputStock)
      return res.status(404).json({ message: "Input stock not found" });

    if (inputStock.quantity < inputQuantity)
      return res.status(400).json({ message: "Insufficient stock" });

    /* Deduct input */
    const previousInput = inputStock.quantity;
    inputStock.quantity -= inputQuantity;

    if (inputStock.quantity === 0) {
      inputStock.status = "Consumed";
    }

    await inputStock.save();

    await StockMovement.create({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
      movementType: "OUT",
      module: "Production",
      quantity: inputQuantity,
      previousStock: previousInput,
      newStock: inputStock.quantity,
      performedBy: req.user._id,
    });

    /* Create output */
    const outputStock = await Inventory.create({
      materialType: outputMaterialType,
      lotNumber: outputLotNumber,
      quantity: outputQuantity,
      status:
        outputMaterialType === "FinishedFabric"
          ? "InProcess"
          : "Available",
      createdBy: req.user._id,
    });

    await StockMovement.create({
      materialType: outputMaterialType,
      lotNumber: outputLotNumber,
      movementType: "IN",
      module: "Production",
      quantity: outputQuantity,
      previousStock: 0,
      newStock: outputQuantity,
      performedBy: req.user._id,
    });

    /* Create production record */
    const wastage = inputQuantity - outputQuantity;
    const efficiency = (outputQuantity / inputQuantity) * 100;

    const production = await Production.create({
      inputMaterialType,
      inputLotNumber,
      inputQuantity,
      outputMaterialType,
      outputLotNumber,
      outputQuantity,
      wastage,
      wastagePercentage: (wastage / inputQuantity) * 100,
      efficiencyPercentage: efficiency,
      createdBy: req.user._id,
    });

    /* Auto create QC if FinishedFabric */
    if (outputMaterialType === "FinishedFabric") {
      await QC.create({
        lotNumber: outputLotNumber,
        materialType: "FinishedFabric",
        status: "Pending",
      });
    }

    res.status(201).json({
      success: true,
      message: "Production completed successfully",
      data: production,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};