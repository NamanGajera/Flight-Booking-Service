const bookingController = require("./booking-route");
const express = require("express");

const router = express.Router();

router.use("/booking", bookingController);

module.exports = router;
