import Supplier from "../models/Supplier.js";

// Create Supplier
export const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);

    res.status(201).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Supplier (Dev only)
export const deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Supplier deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};