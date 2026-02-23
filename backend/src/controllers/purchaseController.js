import Purchase from "../models/Purchase.js";
import { addStock } from "../services/inventoryService.js";
import StockMovement from "../models/StockMovement.js";
import Inventory from "../models/Inventory.js";

export const createPurchase = async (req, res) => {
  try {
    const { supplier, materialType, lotNumber, quantity, unit, ratePerUnit } =
      req.body;

    if (!supplier || !materialType || !lotNumber)
      return res.status(400).json({ message: "All fields required" });

    if (Number(quantity) <= 0)
      return res.status(400).json({ message: "Quantity must be greater than 0" });

    if (Number(ratePerUnit) <= 0)
      return res.status(400).json({ message: "Rate must be greater than 0" });

    const existingLot = await Inventory.findOne({ lotNumber });
    if (existingLot)
      return res.status(400).json({ message: "Lot already exists" });

    const totalAmount = quantity * ratePerUnit;

    const purchase = await Purchase.create({
      supplier,
      materialType,
      lotNumber,
      quantity,
      unit,
      ratePerUnit,
      totalAmount,
      purchasedBy: req.user._id,
    });

    await addStock({
      materialType,
      lotNumber,
      quantity,
      unit,
      location: "Main Warehouse",
      createdBy: req.user._id,
    });

    const stockAfter = await Inventory.findOne({ materialType, lotNumber });

    await StockMovement.create({
      materialType,
      lotNumber,
      movementType: "IN",
      module: "Purchase",
      quantity,
      previousStock: 0,
      newStock: stockAfter.quantity,
      referenceId: purchase._id,
      performedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Purchase created & stock added",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier", "supplierName phone")
      .populate("purchasedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllPurchases = async (req, res) => {
  try {
    await Purchase.deleteMany();
    res.status(200).json({
      success: true,
      message: "All purchase records deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};