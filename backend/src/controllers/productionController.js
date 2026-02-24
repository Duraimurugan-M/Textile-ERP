import Production from "../models/Production.js";
import { addStock, deductStock } from "../services/inventoryService.js";
import StockMovement from "../models/StockMovement.js";
import Inventory from "../models/Inventory.js";
import QueryFeatures from "../utils/queryFeatures.js";
import QC from "../models/QC.js";

/* =====================================================
   ✅ CREATE PRODUCTION
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

    /* ---------- BASIC VALIDATION ---------- */
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

    /* ---------- CHECK OUTPUT LOT ---------- */
    const existingOutputLot = await Inventory.findOne({
      lotNumber: outputLotNumber,
    });

    if (existingOutputLot) {
      return res.status(400).json({
        message: "Output lot already exists",
      });
    }

    /* ---------- CHECK INPUT STOCK ---------- */
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

    /* ---------- DEDUCT INPUT STOCK ---------- */
    await deductStock({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
      quantity: inputQty,
    });

    const inputStockAfter = await Inventory.findOne({
      materialType: inputMaterialType,
      lotNumber: inputLotNumber,
    });

    /* ---------- CALCULATIONS ---------- */
    const wastage = inputQty - outputQty;
    const wastagePercentage = (wastage / inputQty) * 100;
    const efficiencyPercentage = (outputQty / inputQty) * 100;

    /* ---------- CREATE PRODUCTION RECORD ---------- */
    const production = await Production.create({
      inputMaterialType,
      inputLotNumber,
      inputQuantity: inputQty,
      outputMaterialType,
      outputLotNumber,
      outputQuantity: outputQty,
      wastage,
      wastagePercentage: Number(wastagePercentage.toFixed(2)),
      efficiencyPercentage: Number(efficiencyPercentage.toFixed(2)),
      status: "Completed",
      createdBy: req.user._id,
    });

    /* ---------- STOCK MOVEMENT (INPUT OUT) ---------- */
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

    /* ---------- ADD OUTPUT STOCK ---------- */
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

    /* ---------- STOCK MOVEMENT (OUTPUT IN) ---------- */
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

    /* =====================================================
       🔥 IMPORTANT: SET INVENTORY STATUS TO InProcess
       (This means QC Pending Stage)
    ===================================================== */
    if (outputMaterialType === "FinishedFabric") {
      await Inventory.findOneAndUpdate(
        { lotNumber: outputLotNumber },
        { status: "InProcess" }
      );

      /* ---------- CREATE QC (AUTO - Pending) ---------- */
      await QC.create({
        materialType: "FinishedFabric",
        lotNumber: outputLotNumber,
        status: "Pending",
      });
    }

    /* ---------- FINAL RESPONSE ---------- */
    res.status(201).json({
      success: true,
      message: "Production completed successfully",
      data: production,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   ✅ GET PRODUCTIONS
===================================================== */
export const getProductions = async (req, res) => {
  try {
    const totalRecords = await Production.countDocuments();

    const features = new QueryFeatures(
      Production.find(),
      req.query
    )
      .filter()
      .search(["inputLotNumber", "outputLotNumber"])
      .sort()
      .paginate();

    const productions = await features.query.populate(
      "createdBy",
      "name email"
    );

    res.json({
      success: true,
      data: productions,
      currentPage: features.page,
      totalPages: Math.ceil(totalRecords / features.limit),
      totalRecords,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   🧹 DELETE ALL (DEV ONLY)
===================================================== */
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