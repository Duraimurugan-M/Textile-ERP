import mongoose from "mongoose";

const productionSchema = new mongoose.Schema(
  {
    // Raw material used
    inputMaterialType: {
      type: String,
      enum: ["RawYarn", "DyedYarn", "GreyFabric", "FinishedFabric"],
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

    // Output material produced
    outputMaterialType: {
      type: String,
      enum: ["RawYarn", "DyedYarn", "GreyFabric", "FinishedFabric"],
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

    status: {
      type: String,
      enum: ["Planned", "InProcess", "Completed"],
      default: "Planned",
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
