const express = require("express");
const { BookingController } = require("../controllers");
const { BookingMiddleware } = require("../middlewares");

const router = express.Router();

router.post(
  "/",
  BookingMiddleware.validateCreateRequest,
  BookingController.createBooking
);

router.post(
  "/payment",
  BookingMiddleware.validatePaymentRequest,
  BookingController.makePayment,
);

router.get(
  "",
  BookingController.getAllUserBooking
);

module.exports = router;
