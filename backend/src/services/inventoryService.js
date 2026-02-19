import Inventory from "../models/Inventory.js";

// ✅ Add Stock
export const addStock = async (data) => {
  return await Inventory.create(data);
};

// ✅ Reduce Stock (Generic use)
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

// ✅ Get All Stock
export const getAllStock = async () => {
  return await Inventory.find();
};

// ✅ Deduct Stock (Used in Production)
export const deductStock = async ({
  materialType,
  lotNumber,
  quantity,
}) => {
  const stock = await Inventory.findOne({
    materialType,
    lotNumber,
    status: "Available",
  });

  if (!stock) {
    throw new Error("Stock not found");
  }

  if (stock.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  stock.quantity -= quantity;

  if (stock.quantity === 0) {
    stock.status = "Consumed";
  }

  await stock.save();

  return stock;
};
