import Role from "../models/Role.js";

// 🔹 Create Role
export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({
      name,
      permissions,
    });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update Role Permissions
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({
      success: true,
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Role
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
