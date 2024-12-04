const express = require("express");
const router = express.Router();
const machineController = require("../controllers/machineController");

router.post("/", machineController.createMachine);
router.get("/", machineController.getAllMachines);
router.patch("/:id", machineController.updateMachine);
router.delete("/:id", machineController.deleteMachine);

module.exports = router;
