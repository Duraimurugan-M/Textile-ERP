import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
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
    },

    ratePerUnit: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Sales = mongoose.model("Sales", salesSchema);
export default Sales;
