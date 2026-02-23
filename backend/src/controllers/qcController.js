import QC from "../models/QC.js";
import Inventory from "../models/Inventory.js";

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

export const getQCList = async (req, res) => {
  try {
    const qcList = await QC.find()
      .populate("inspectedBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: qcList,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};