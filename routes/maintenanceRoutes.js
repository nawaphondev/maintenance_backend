const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");

router.post("/", maintenanceController.createMaintenanceRecord);
router.get("/", maintenanceController.getAllMaintenanceRecords);
router.patch("/:id", maintenanceController.updateMaintenanceRecord);
router.delete("/:id", maintenanceController.deleteMaintenanceRecord);

module.exports = router;
