import Sales from "../models/Sales.js";
import Inventory from "../models/Inventory.js";
import StockMovement from "../models/StockMovement.js";

/* =====================================================
   CREATE SALE
===================================================== */
export const createSale = async (req, res) => {
  try {
    const { invoiceNumber, customerName, lotNumber, quantity, pricePerUnit } =
      req.body;

    const stock = await Inventory.findOne({
      lotNumber,
      materialType: "FinishedFabric",
      status: "Available",
    });

    if (!stock)
      return res.status(404).json({
        message: "Finished Fabric not available or not approved",
      });

    if (stock.quantity < quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    const previousQty = stock.quantity;
    stock.quantity -= quantity;

    if (stock.quantity === 0) {
      stock.status = "Consumed";
    }

    await stock.save();

    await StockMovement.create({
      materialType: "FinishedFabric",
      lotNumber,
      movementType: "OUT",
      module: "Sales",
      quantity,
      previousStock: previousQty,
      newStock: stock.quantity,
      performedBy: req.user._id,
    });

    const sale = await Sales.create({
      invoiceNumber,
      customerName,
      lotNumber,
      quantity,
      pricePerUnit,
      totalAmount: quantity * pricePerUnit,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Sale completed successfully",
      data: sale,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};