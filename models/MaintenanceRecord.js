const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Machine = require("./Machine");

const MaintenanceRecord = sequelize.define(
  "MaintenanceRecord",
  {
    machine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Machine,
        key: "id",
      },
    },
    maintenance_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
    },
    performed_by: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "maintenance_records",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// กำหนดความสัมพันธ์ระหว่าง MaintenanceRecord และ Machine
MaintenanceRecord.belongsTo(Machine, { foreignKey: "machine_id" });

module.exports = MaintenanceRecord;
