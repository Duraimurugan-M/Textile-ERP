import mongoose from "mongoose";

const productionSchema = new mongoose.Schema(
  {
    inputMaterialType: {
      type: String,
      required: true,
    },

    inputLotNumber: {
      type: String,
      required: true,
    },

    inputQuantity: {
      type: Number,
      required: true,
    },

    outputMaterialType: {
      type: String,
      required: true,
    },

    outputLotNumber: {
      type: String,
      required: true,
    },

    outputQuantity: {
      type: Number,
      required: true,
    },

    // 🆕 NEW FIELDS
    wastage: {
      type: Number,
      default: 0,
    },

    wastagePercentage: {
      type: Number,
      default: 0,
    },
    
    efficiencyPercentage: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Planned", "InProcess", "Completed"],
      default: "Completed",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Production = mongoose.model("Production", productionSchema);
export default Production;