import mongoose from "mongoose";

const yarnSchema = new mongoose.Schema(
  {
    yarnName: { type: String, required: true },
    count: { type: String, required: true },
    composition: { type: String, required: true },
    shade: {
      type: String,
      enum: ["Raw", "Dyed", "Bleached", "Printed"],
      default: "Raw",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    lotNumber: {
      type: String,
      required: true,
      unique: true,
    },

    totalQuantity: {
      type: Number,
      required: true,
    },

    quantityAvailable: {
      type: Number,
      required: true,
    },

    quantityInJobWork: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
      default: "kg",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Yarn", yarnSchema);