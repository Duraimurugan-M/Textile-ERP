import mongoose from "mongoose";

const jobWorkSchema = new mongoose.Schema(
  {
    yarn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Yarn",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    yarnLotNumber: {
      type: String,
      required: true,
    },

    sentQuantity: {
      type: Number,
      required: true,
    },

    receivedQuantity: {
      type: Number,
      default: 0,
    },

    dyeShade: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Sent", "Completed"],
      default: "Sent",
    },

    sentDate: {
      type: Date,
      default: Date.now,
    },

    receivedDate: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const JobWork = mongoose.model("JobWork", jobWorkSchema);

export default JobWork;