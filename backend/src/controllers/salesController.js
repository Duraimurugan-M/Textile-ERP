import Sales from "../models/Sales.js";
import StockMovement from "../models/StockMovement.js";
import Inventory from "../models/Inventory.js";
import { deductStock } from "../services/inventoryService.js";
import QC from "../models/QC.js";
import QueryFeatures from "../utils/queryFeatures.js";

// ✅ Create Sale
export const createSale = async (req, res) => {
  try {
    const { customer, materialType, lotNumber, quantity, ratePerUnit } =
      req.body;

    if (materialType !== "FinishedFabric") {
      return res.status(400).json({
        message: "Only Finished Fabric can be sold",
      });
    }

    const qty = Number(quantity);
    const rate = Number(ratePerUnit);

    if (!customer || !lotNumber || isNaN(qty) || isNaN(rate)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    if (qty <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    // 🔒 QC Check
    const qcRecord = await QC.findOne({ lotNumber });
    if (!qcRecord)
      return res.status(400).json({ message: "QC not completed" });

    if (qcRecord.status !== "Approved")
      return res.status(400).json({ message: "QC not approved" });

    // 🔒 Check Inventory
    const stockBefore = await Inventory.findOne({
      materialType: "FinishedFabric",
      lotNumber,
    });

    if (!stockBefore)
      return res.status(400).json({ message: "Lot not found" });

    if (stockBefore.quantity < qty)
      return res.status(400).json({
        message: `Insufficient stock. Available: ${stockBefore.quantity}`,
      });

    // 🔻 Deduct stock
    await deductStock({
      materialType: "FinishedFabric",
      lotNumber,
      quantity: qty,
    });

    // Get updated stock
    const stockAfter = await Inventory.findOne({
      materialType: "FinishedFabric",
      lotNumber,
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

    // 📘 Ledger Entry
    await StockMovement.create({
      materialType: "FinishedFabric",
      lotNumber,
      movementType: "OUT",
      module: "Sale",
      quantity: qty,
      previousStock: stockBefore.quantity,
      newStock: stockAfter.quantity,
      referenceId: sale._id,
      performedBy: req.user._id,
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
    const totalRecords = await Sales.countDocuments();

    const features = new QueryFeatures(Sales, req.query)
      .filter()
      .search(["lotNumber"])
      .sort()
      .paginate();

    const sales = await features.query
      .populate("customer", "customerName phone")
      .populate("soldBy", "name");

    res.json({
      success: true,
      data: sales,
      currentPage: features.page,
      totalPages: Math.ceil(totalRecords / features.limit),
      totalRecords,
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