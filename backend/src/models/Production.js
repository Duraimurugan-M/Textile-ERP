import mongoose from "mongoose";

const productionSchema = new mongoose.Schema(
  {
    inputMaterialType: {
      type: String,
      enum: ["RawYarn", "DyedYarn", "GreyFabric"],
      required: true,
    },

    inputLotNumber: {
      type: String,
      required: true,
    },

    inputQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    outputMaterialType: {
      type: String,
      enum: ["DyedYarn", "GreyFabric", "FinishedFabric"],
      required: true,
    },

    outputLotNumber: {
      type: String,
      required: true,
      unique: true,
    },

    outputQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

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
      enum: ["Completed"],
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