const sequelize = require("../config/db");
const MaintenanceRecord = require("../models/MaintenanceRecord");
const Machine = require("../models/Machine");

// สรุปรายงานการบำรุงรักษาทั้งหมด
exports.getMaintenanceSummary = async (req, res) => {
  try {
    const summary = await MaintenanceRecord.findAll({
      attributes: [
        "machine_id",
        [
          sequelize.fn("COUNT", sequelize.col("MaintenanceRecord.id")),
          "maintenance_count",
        ],
        [
          sequelize.fn("MAX", sequelize.col("maintenance_date")),
          "last_maintenance_date",
        ],
      ],
      group: ["machine_id"],
      include: [{ model: Machine, attributes: ["name"] }],
    });
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
