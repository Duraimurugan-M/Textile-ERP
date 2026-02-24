import QC from "../models/QC.js";
import Inventory from "../models/Inventory.js";
import QueryFeatures from "../utils/queryFeatures.js";

export const createQC = async (req, res) => {
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

    // 🔍 Check lot exists
    const inventoryLot = await Inventory.findOne({
      lotNumber,
      materialType: "FinishedFabric",
    });

    if (!inventoryLot)
      return res.status(404).json({ message: "Lot not found" });

    // 🔒 Check QC already done
    const existingQC = await QC.findOne({ lotNumber });
    if (existingQC)
      return res.status(400).json({ message: "QC already completed for this lot" });

    const qc = await QC.create({
      lotNumber,
      materialType: "FinishedFabric",
      gsm,
      width,
      shrinkage,
      defectPercentage,
      grade,
      status,
      inspectedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "QC completed successfully",
      data: qc,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQCRecords = async (req, res) => {
  try {
    const totalRecords = await QC.countDocuments();

    const features = new QueryFeatures(QC, req.query)
      .filter()
      .search(["lotNumber", "grade"])
      .sort()
      .paginate();

    const qc = await features.query
      .populate("inspectedBy", "name");

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

// delete all qc rocords (Dev only)
export const deleteQCRecords = async (req, res) => {
  try {
    await QC.deleteMany();
    res.json({ success: true, message: "All QC records deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};