import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    materialType: {
      type: String,
      enum: ["FinishedFabric"], // Only finished goods can be sold
      required: true,
    },

    lotNumber: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    ratePerUnit: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sales", salesSchema);