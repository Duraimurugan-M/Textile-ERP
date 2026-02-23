import mongoose from "mongoose";

const qcSchema = new mongoose.Schema(
  {
    lotNumber: {
      type: String,
      required: true,
      unique: true, // one QC per lot
    },

    materialType: {
      type: String,
      enum: ["FinishedFabric"],
      required: true,
    },

    gsm: {
      type: Number,
      required: true,
    },

    width: {
      type: Number,
      required: true,
    },

    shrinkage: {
      type: Number,
      required: true,
    },

    defectPercentage: {
      type: Number,
      required: true,
    },

    grade: {
      type: String,
      enum: ["A", "B", "C"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Approved", "Rejected"],
      required: true,
    },

    inspectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("QC", qcSchema);