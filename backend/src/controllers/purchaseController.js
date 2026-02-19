import Purchase from "../models/Purchase.js";
import { addStock } from "../services/inventoryService.js";

export const createPurchase = async (req, res) => {
  try {
    const {
      supplierName,
      lotNumber,
      quantity,
      unit,
      ratePerUnit,
    } = req.body;

    const totalAmount = quantity * ratePerUnit;

    // 1️⃣ Create Purchase Record
    const purchase = await Purchase.create({
      supplierName,
      lotNumber,
      quantity,
      unit,
      ratePerUnit,
      totalAmount,
      purchasedBy: req.user._id,
    });

    // 2️⃣ Add Stock to Inventory
    await addStock({
      materialType: "RawYarn",
      lotNumber,
      quantity,
      unit,
      location: "Main Warehouse",
      createdBy: req.user._id,
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

// Get all purchases
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
