const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/maintenance-summary", reportController.getMaintenanceSummary);

module.exports = router;
