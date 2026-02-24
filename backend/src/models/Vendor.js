import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },

    contactPerson: {
      type: String,
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
    },

    address: {
      type: String,
    },

    jobType: {
      type: String,
      enum: ["Dyeing", "Warping", "Sizing", "Finishing"],
      default: "Dyeing",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;