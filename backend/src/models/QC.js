import mongoose from "mongoose";

const qcSchema = new mongoose.Schema(
  {
    lotNumber: {
      type: String,
      required: true,
      unique: true,
    },

    materialType: {
      type: String,
      enum: ["FinishedFabric"],
      required: true,
    },

    gsm: {
      type: Number,
    },

    width: {
      type: Number,
    },

    shrinkage: {
      type: Number,
    },

    defectPercentage: {
      type: Number,
    },

    grade: {
      type: String,
      enum: ["A", "B", "C"],
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    inspectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("QC", qcSchema);