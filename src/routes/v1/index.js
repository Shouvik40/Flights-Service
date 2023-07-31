const express = require("express");

const { InfoController } = require("../../controllers");
const airplaneRoutes = require("./airplane-routes");
const cityRoutes = require("./city-routes");

const router = express.Router();

///api/v1/airplanes
router.use("/airplanes", airplaneRoutes);
router.use("/cities", cityRoutes);

module.exports = router;
