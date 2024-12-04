const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const ProductionLine = require("./ProductionLine");

const Machine = sequelize.define(
  "Machine",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    production_line_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ProductionLine,
        key: "id",
      },
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Machine;
