import Inventory from "../models/Inventory.js";
import Production from "../models/Production.js";
import Sales from "../models/Sales.js";
import QC from "../models/QC.js";
import mongoose from "mongoose";

export const getDashboardData = async (req, res) => {
  try {

    // 🔹 1️⃣ Total Stock Quantity
    const totalStockAgg = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    const totalStockQuantity =
      totalStockAgg.length > 0 ? totalStockAgg[0].totalQuantity : 0;

    // 🔹 2️⃣ Total Stock Value
    // (Assuming ratePerUnit stored in Inventory)
    const totalStockValueAgg = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ["$quantity", "$ratePerUnit"] },
          },
        },
      },
    ]);

    const totalStockValue =
      totalStockValueAgg.length > 0
        ? totalStockValueAgg[0].totalValue
        : 0;

    // 🔹 3️⃣ Today's Production Count
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayProductionCount = await Production.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    // 🔹 4️⃣ Today's Sales Amount
    const todaySalesAgg = await Sales.aggregate([
      {
        $match: { createdAt: { $gte: startOfDay } },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const todaySalesAmount =
      todaySalesAgg.length > 0 ? todaySalesAgg[0].totalSales : 0;

    // 🔹 5️⃣ Low Stock Alert (quantity < 50)
    const lowStockCount = await Inventory.countDocuments({
      quantity: { $lt: 50 },
    });

    // 🔹 6️⃣ QC Pending Count
    const qcPendingCount = await QC.countDocuments({
      status: { $ne: "Approved" },
    });

    // 🔹 7️⃣ Top 5 Customers (by sales)
    const topCustomers = await Sales.aggregate([
      {
        $group: {
          _id: "$customer",
          totalPurchase: { $sum: "$totalAmount" },
        },
      },
      { $sort: { totalPurchase: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: "$customerDetails",
      },
      {
        $project: {
          customerName: "$customerDetails.customerName",
          totalPurchase: 1,
        },
      },
    ]);

    // 🔹 8️⃣ Monthly Sales Graph (last 12 months)
    const monthlySales = await Sales.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalStockQuantity,
        totalStockValue,
        todayProductionCount,
        todaySalesAmount,
        lowStockCount,
        qcPendingCount,
        topCustomers,
        monthlySales,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};