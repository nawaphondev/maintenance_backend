const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProductionLine = sequelize.define(
  "ProductionLine",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "production_lines", // ระบุชื่อตารางที่ใช้ในฐานข้อมูลอย่างชัดเจน
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = ProductionLine;
