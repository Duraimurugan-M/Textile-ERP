import QC from "../models/QC.js";
import Inventory from "../models/Inventory.js";
import QueryFeatures from "../utils/queryFeatures.js";

/* =====================================================
   ✅ UPDATE QC (Approve / Reject)
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

    // Update QC fields
    qc.gsm = gsm;
    qc.width = width;
    qc.shrinkage = shrinkage;
    qc.defectPercentage = defectPercentage;
    qc.grade = grade;
    qc.status = status;
    qc.inspectedBy = req.user._id;

    await qc.save();

    /* 🔥 IMPORTANT: Sync Inventory Status */
    if (status === "Approved") {
      await Inventory.findOneAndUpdate(
        { lotNumber },
        { status: "Available" }
      );
    } else if (status === "Rejected") {
      await Inventory.findOneAndUpdate(
        { lotNumber },
        { status: "Rejected" }
      );
    }

    res.status(200).json({
      success: true,
      message: "QC updated successfully",
      data: qc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   📦 GET QC RECORDS
===================================================== */
export const getQCRecords = async (req, res) => {
  try {
    const totalRecords = await QC.countDocuments();

    const features = new QueryFeatures(QC.find(), req.query)
      .filter()
      .search(["lotNumber", "grade"])
      .sort()
      .paginate();

    const qc = await features.query.populate("inspectedBy", "name");

    res.json({
      success: true,
      data: qc,
      currentPage: features.page,
      totalPages: Math.ceil(totalRecords / features.limit),
      totalRecords,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   🧹 DELETE ALL QC (DEV)
===================================================== */
export const deleteQCRecords = async (req, res) => {
  try {
    await QC.deleteMany();
    res.json({ success: true, message: "All QC records deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};