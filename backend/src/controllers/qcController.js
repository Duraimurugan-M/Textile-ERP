import QC from "../models/QC.js";
import Inventory from "../models/Inventory.js";

/* =====================================================
   UPDATE QC (Approve / Reject)
===================================================== */
export const updateQC = async (req, res) => {
  try {
    const {
      lotNumber,
      gsm,
      width,
      shrinkage,
      defectPercentage,
      grade,
      status,
    } = req.body;

    const qc = await QC.findOne({ lotNumber });

    if (!qc)
      return res.status(404).json({ message: "QC record not found" });

    qc.gsm = gsm;
    qc.width = width;
    qc.shrinkage = shrinkage;
    qc.defectPercentage = defectPercentage;
    qc.grade = grade;
    qc.status = status;
    qc.inspectedBy = req.user._id;

    await qc.save();

    /* Sync Inventory */
    if (status === "Approved") {
      await Inventory.findOneAndUpdate(
        { lotNumber },
        { status: "Available" }
      );
    }

    if (status === "Rejected") {
      await Inventory.findOneAndUpdate(
        { lotNumber },
        { status: "Rejected" }
      );
    }

    res.json({
      success: true,
      message: "QC updated successfully",
      data: qc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};