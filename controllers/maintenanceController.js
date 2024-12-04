const sequelize = require("../config/db");
const MaintenanceRecord = require("../models/MaintenanceRecord");
const Machine = require("../models/Machine");

// เพิ่มบันทึกการบำรุงรักษา
exports.createMaintenanceRecord = async (req, res) => {
  const { machine_id, maintenance_date, details, performed_by } = req.body;
  try {
    const maintenanceRecord = await MaintenanceRecord.create({
      machine_id,
      maintenance_date,
      details,
      performed_by,
    });
    res
      .status(201)
      .json({
        message: "Maintenance record created successfully",
        maintenanceRecord,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ดึงข้อมูลการบำรุงรักษาทั้งหมด
exports.getAllMaintenanceRecords = async (req, res) => {
  try {
    const maintenanceRecords = await MaintenanceRecord.findAll({
      include: [{ model: Machine, attributes: ["name"] }],
    });
    res.status(200).json(maintenanceRecords);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// แก้ไขบันทึกการบำรุงรักษา
exports.updateMaintenanceRecord = async (req, res) => {
  const { id } = req.params;
  const { maintenance_date, details, performed_by } = req.body;
  try {
    const maintenanceRecord = await MaintenanceRecord.findByPk(id);
    if (!maintenanceRecord) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }
    await maintenanceRecord.update({ maintenance_date, details, performed_by });
    res
      .status(200)
      .json({
        message: "Maintenance record updated successfully",
        maintenanceRecord,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ลบบันทึกการบำรุงรักษา
exports.deleteMaintenanceRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const maintenanceRecord = await MaintenanceRecord.findByPk(id);
    if (!maintenanceRecord) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }
    await maintenanceRecord.destroy();
    res
      .status(200)
      .json({ message: "Maintenance record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
