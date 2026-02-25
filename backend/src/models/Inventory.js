import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    materialType: {
      type: String,
      enum: ["RawYarn", "DyedYarn", "GreyFabric", "FinishedFabric"],
      required: true,
    },

    lotNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      default: "kg",
    },

    status: {
      type: String,
      enum: ["Available", "InProcess", "Rejected", "Consumed"],
      default: "Available",
    },

    location: {
      type: String,
      default: "Main Warehouse",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;