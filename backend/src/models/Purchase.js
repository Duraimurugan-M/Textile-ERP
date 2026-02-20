import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    materialType: {
      type: String,
      enum: ["RawYarn", "DyedYarn", "GreyFabric", "FinishedFabric"],
      required: true,
    },

    lotNumber: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      enum: ["kg", "meter"],
      default: "kg",
    },

    ratePerUnit: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
    },

    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);