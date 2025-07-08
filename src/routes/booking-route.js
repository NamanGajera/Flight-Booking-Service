const express = require("express");
const { BookingController } = require("../controllers");
const { BookingMiddleware } = require("../middlewares");

const router = express.Router();

router.post(
  "/",
  BookingMiddleware.validateCreateRequest,
  BookingController.createBooking
);

module.exports = router;
