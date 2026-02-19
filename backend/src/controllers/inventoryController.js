import Inventory from "../models/Inventory.js";

import {
  addStock,
  getAllStock
} from "../services/inventoryService.js";

// ➕ Add Stock
export const createStock = async (req, res) => {
  try {
    const stock = await addStock({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: stock,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📦 Get All Stock
export const fetchAllStock = async (req, res) => {
  try {
    const stock = await getAllStock();

    res.status(200).json({
      success: true,
      data: stock,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➖ Reduce Stock
export const consumeStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updatedStock = await reduceStock(id, quantity);

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: updatedStock,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🧹 Delete All Stock (For Development/Testing)
export const deleteAllStock = async (req, res) => {
  try {
    await Inventory.deleteMany();
    res.status(200).json({
      success: true,
      message: "All stock deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};