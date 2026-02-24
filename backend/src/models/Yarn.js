import mongoose from "mongoose";

const yarnSchema = new mongoose.Schema(
  {
    yarnName: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: String, // e.g., 40s, 60s
      required: true,
    },
    composition: {
      type: String, // Cotton / Polyester / PC
      required: true,
    },
    shade: {
      type: String,
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
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: "kg",
    },
    status: {
      type: String,
      enum: ["Available", "SentToJobWork", "Consumed"],
      default: "Available",
    },
  },
  { timestamps: true }
);

const Yarn = mongoose.model("Yarn", yarnSchema);
export default Yarn;