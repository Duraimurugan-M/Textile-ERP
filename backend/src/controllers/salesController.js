import Sales from "../models/Sales.js";
import { deductStock } from "../services/inventoryService.js";

export const createSale = async (req, res) => {
  try {
    const {
      customerName,
      materialType,
      lotNumber,
      quantity,
      ratePerUnit,
    } = req.body;

    const totalAmount = quantity * ratePerUnit;

    // 1️⃣ Deduct Stock
    await deductStock({
      materialType,
      lotNumber,
      quantity,
    });

    // 2️⃣ Create Sales Record
    const sale = await Sales.create({
      customerName,
      materialType,
      lotNumber,
      quantity,
      ratePerUnit,
      totalAmount,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Sale created & stock deducted",
      data: sale,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sales.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
