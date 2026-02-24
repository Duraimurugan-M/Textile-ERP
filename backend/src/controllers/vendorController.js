import Vendor from "../models/Vendor.js";

// 🔹 Create Vendor
export const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      data: vendor,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Vendors (Server Side Ready)
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: vendors,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete All Vendors (Dev Only)
export const deleteAllVendors = async (req, res) => {
  try {
    await Vendor.deleteMany();

    res.json({
      success: true,
      message: "All vendors deleted",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};