import JobWork from "../models/JobWork.js";
import Yarn from "../models/Yarn.js";
import Inventory from "../models/Inventory.js";
import StockMovement from "../models/StockMovement.js";

// ==================================================
// 1️⃣ SEND YARN TO JOB WORK
// ==================================================
export const sendToJobWork = async (req, res) => {
  try {
    const { yarnLotNumber, vendorId, sentQuantity } = req.body;

    const yarn = await Yarn.findOne({ lotNumber: yarnLotNumber });
    if (!yarn)
      return res.status(400).json({ message: "Yarn not found" });

    if (yarn.quantityAvailable < sentQuantity)
      return res.status(400).json({ message: "Insufficient Available Yarn" });

    // Update Yarn Quantities
    yarn.quantityAvailable -= sentQuantity;
    yarn.quantityInJobWork += sentQuantity;
    await yarn.save();

    // Update Inventory
    const inventory = await Inventory.findOne({
      lotNumber: yarnLotNumber,
    });

    const previousStock = inventory.quantity;
    inventory.quantity -= sentQuantity;
    await inventory.save();

    // Stock Movement OUT
    await StockMovement.create({
      materialType: "RawYarn",
      lotNumber: yarnLotNumber,
      movementType: "OUT",
      module: "JobWork",
      quantity: sentQuantity,
      previousStock,
      newStock: inventory.quantity,
      referenceId: yarn._id,
      performedBy: req.user._id,
    });

    // Create JobWork Record
    const jobWork = await JobWork.create({
      yarn: yarn._id,
      vendor: vendorId,
      yarnLotNumber,
      sentQuantity,
      status: "Sent",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Yarn Sent To Job Work",
      data: jobWork,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==================================================
// 2️⃣ RECEIVE FROM JOB WORK
// ==================================================
export const receiveFromJobWork = async (req, res) => {
  try {
    const { jobWorkId, receivedQuantity, dyeShade } = req.body;

    const jobWork = await JobWork.findById(jobWorkId);
    if (!jobWork)
      return res.status(400).json({ message: "JobWork not found" });

    if (jobWork.status === "Completed")
      return res.status(400).json({ message: "Already completed" });

    const yarn = await Yarn.findById(jobWork.yarn);

    // Reduce In Job Work
    yarn.quantityInJobWork -= receivedQuantity;
    await yarn.save();

    // Generate unique dyed lot
    const existingCount = await Inventory.countDocuments({
      lotNumber: { $regex: `^${jobWork.yarnLotNumber}-DYED` },
    });

    const dyedLot = `${jobWork.yarnLotNumber}-DYED-${existingCount + 1}`;

    // Create Dyed Inventory
    await Inventory.create({
      materialType: "DyedYarn",
      lotNumber: dyedLot,
      quantity: receivedQuantity,
      unit: "kg",
      location: "Dyed Yarn Warehouse",
      status: "Available",
      referenceId: jobWork._id,
      createdBy: req.user._id,
    });

    // Stock Movement IN
    await StockMovement.create({
      materialType: "DyedYarn",
      lotNumber: dyedLot,
      movementType: "IN",
      module: "JobWork",
      quantity: receivedQuantity,
      previousStock: 0,
      newStock: receivedQuantity,
      referenceId: jobWork._id,
      performedBy: req.user._id,
    });

    // Update JobWork
    jobWork.receivedQuantity = receivedQuantity;
    jobWork.dyeShade = dyeShade;
    jobWork.status = "Completed";
    jobWork.receivedDate = new Date();
    await jobWork.save();

    res.json({
      success: true,
      message: "Dyed Yarn Received Successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==================================================
// 3️⃣ GET ALL JOB WORKS
// ==================================================
export const getJobWorks = async (req, res) => {
  try {
    const jobs = await JobWork.find()
      .populate("yarn", "yarnName lotNumber quantityAvailable quantityInJobWork")
      .populate("vendor", "vendorName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: jobs,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete the job work :id (Dev Only)
export const deleteJobWork = async (req, res) => {
  try {
    await JobWork.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "JobWork deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};