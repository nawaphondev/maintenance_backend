const express = require("express");
const router = express.Router();
const productionLineController = require("../controllers/productionLineController");

router.post("/", productionLineController.createProductionLine);
router.get("/", productionLineController.getAllProductionLines);
router.patch("/:id", productionLineController.updateProductionLine);
router.delete("/:id", productionLineController.deleteProductionLine);

module.exports = router;
