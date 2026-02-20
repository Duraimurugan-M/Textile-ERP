import Customer from "../models/Customer.js";

// Create Customer
export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Customer (Dev Only)
export const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Customer deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};