import Sales from "../models/Sales.js";
import Inventory from "../models/Inventory.js";
import { deductStock } from "../services/inventoryService.js";

// ✅ Create Sale
export const createSale = async (req, res) => {
  try {
    const { customer, materialType, lotNumber, quantity, ratePerUnit } = req.body;

    // 1️⃣ Only FinishedFabric allowed
    if (materialType !== "FinishedFabric") {
      return res.status(400).json({
        message: "Only Finished Fabric can be sold",
      });
    }

    if (Number(quantity) <= 0)
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });

    const qty = Number(quantity);
    const rate = Number(ratePerUnit);

    if (!customer || !lotNumber || isNaN(qty) || isNaN(rate)) {
      return res.status(400).json({
        message: "Invalid input data",
      });
    }

    // 2️⃣ Check inventory stock
    const stock = await Inventory.findOne({
      materialType: "FinishedFabric",
      lotNumber,
    });

    if (!stock) {
      return res.status(400).json({
        message: "Lot not found in inventory",
      });
    }

    if (stock.quantity < qty) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${stock.quantity}`,
      });
    }

    // 3️⃣ Deduct stock safely
    await deductStock({
      materialType: "FinishedFabric",
      lotNumber,
      quantity: qty,
    });

    const totalAmount = qty * rate;

    const sale = await Sales.create({
      customer,
      materialType: "FinishedFabric",
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

// ✅ Get Sales
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

// ✅ Delete All Sales (Admin Only)
export const deleteAllSales = async (req, res) => {
  try {
    await Sales.deleteMany();
    res.json({
      success: true,
      message: "All sales records deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};