import Purchase from "../models/Purchase.js";
import { addStock } from "../services/inventoryService.js";

export const createPurchase = async (req, res) => {
  try {
    const {
      supplier,
      lotNumber,
      quantity,
      unit,
      ratePerUnit,
    } = req.body;

    const totalAmount = quantity * ratePerUnit;

    const purchase = await Purchase.create({
      supplier,
      lotNumber,
      quantity,
      unit,
      ratePerUnit,
      totalAmount,
      purchasedBy: req.user._id,
    });

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

// Delete all purchases (for testing/development)
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