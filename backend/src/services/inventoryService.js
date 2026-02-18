import Inventory from "../models/Inventory.js";

// Add Stock
export const addStock = async (data) => {
  return await Inventory.create(data);
};

// Reduce Stock
export const reduceStock = async (id, quantity) => {
  const item = await Inventory.findById(id);

  if (!item) throw new Error("Stock not found");

  if (item.quantity < quantity)
    throw new Error("Insufficient stock");

  item.quantity -= quantity;

  if (item.quantity === 0) {
    item.status = "Consumed";
  }

  await item.save();
  return item;
};

// Get All Stock
export const getAllStock = async () => {
  return await Inventory.find();
};
