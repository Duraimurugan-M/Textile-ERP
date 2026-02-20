import Sales from "../models/Sales.js";
import { deductStock } from "../services/inventoryService.js";

// Create Sale
export const createSale = async (req, res) => {
  try {
    const {
      customer,
      materialType,
      lotNumber,
      quantity,
      ratePerUnit,
    } = req.body;

    // Business rule: Only Finished Fabric
    if (materialType !== "FinishedFabric") {
      return res.status(400).json({
        message: "Only Finished Fabric can be sold",
      });
    }

    const qty = Number(quantity);
    const rate = Number(ratePerUnit);

    if (isNaN(qty) || isNaN(rate)) {
      return res.status(400).json({
        message: "Invalid quantity or rate",
      });
    }

    // Deduct from inventory
    await deductStock({
      materialType,
      lotNumber,
      quantity: qty,
    });

    const totalAmount = qty * rate;

    const sale = await Sales.create({
      customer,
      materialType,
      lotNumber,
      quantity: qty,
      ratePerUnit: rate,
      totalAmount,
      soldBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      data: sale,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sales.find()
      .populate("customer", "customerName phone")
      .populate("soldBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete All Sales - For testing purposes only
export const deleteAllSales = async (req, res) => {
  try {
    await Sales.deleteMany({});
    res.json({
      success: true,
      message: "All sales deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};