import Purchase from "../models/Purchase.js";
import { addStock } from "../services/inventoryService.js";

export const createPurchase = async (req, res) => {
  try {
    const {
      supplier,
      materialType,
      lotNumber,
      quantity,
      unit,
      ratePerUnit,
    } = req.body;

    const qty = Number(quantity);
    const rate = Number(ratePerUnit);

    if (isNaN(qty) || isNaN(rate)) {
      return res.status(400).json({
        message: "Invalid quantity or rate",
      });
    }

    const totalAmount = qty * rate;

    const purchase = await Purchase.create({
      supplier,
      materialType,
      lotNumber,
      quantity: qty,
      unit,
      ratePerUnit: rate,
      totalAmount,
      purchasedBy: req.user._id,
    });

    // 🔥 Add stock based on selected materialType
    await addStock({
      materialType,
      lotNumber,
      quantity: qty,
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