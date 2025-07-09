const { BookingService } = require("../services");
const { Enums } = require("../utils/common");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

const { STATUS_CODE } = Enums;

async function createBooking(req, res) {
  try {
    const flight = await BookingService.createBooking({
      flightId: req.body.flightId,
      userId: req.body.userId,
      noOfSeats: req.body.noOfSeats,
    });
    SuccessResponse.data = flight;
    SuccessResponse.message = "Successfully flight booked";
    return res.status(STATUS_CODE.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    res.status(error.statusCode || 500).json(ErrorResponse);
  }
}
async function makePayment(req, res) {
  try {
    const flight = await BookingService.makePayment({
      bookingId: req.body.bookingId,
      userId: req.body.userId,
      amount: req.body.amount,
    });
    SuccessResponse.data = flight;
    SuccessResponse.message = "Successfully flight booked";
    return res.status(STATUS_CODE.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

async function getAllUserBooking(req, res) {
  try {
    const bookingData = await BookingService.getAllUserBooking({ userId: req.query.userId });
    SuccessResponse.data = bookingData;
    SuccessResponse.message = "Successfully fetch data";
    return res.status(STATUS_CODE.CREATED).json(SuccessResponse);
  } catch (error) {

    ErrorResponse.message = error.message;
    res.status(error.statusCode || 500).json(ErrorResponse);
  }

}

module.exports = {
  createBooking,
  makePayment,
  getAllUserBooking
};
