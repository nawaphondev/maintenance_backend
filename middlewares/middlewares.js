const express = require("express");
const morgan = require("morgan");

const router = express.Router();

router.use(morgan("dev"));
router.use(express.json());

module.exports = router;
