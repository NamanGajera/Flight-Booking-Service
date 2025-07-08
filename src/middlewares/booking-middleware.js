const { ErrorResponse, Enums, Messages } = require("../utils/common");
const { STATUS_CODE } = Enums;

function validateCreateRequest(req, res, next) {
  const { flightId, userId, noOfSeats } = req.body;

  if (!req.body) {
    ErrorResponse.message = Messages.REQUIRED_BODY;
    ErrorResponse.statusCode = STATUS_CODE.BAD_REQUEST;
    return res.status(STATUS_CODE.BAD_REQUEST).json(ErrorResponse);
  }

  const requiredFields = ["flightId", "noOfSeats", "userId"];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      ErrorResponse.message = Messages.REQUIRED_FIELD(field);
      return res.status(STATUS_CODE.BAD_REQUEST).json(ErrorResponse);
    }
  }

  if (noOfSeats < 1) {
    ErrorResponse.message = Messages.SEAT_BOOKING_MIN_LIMIT;
    return res.status(STATUS_CODE.BAD_REQUEST).json(ErrorResponse);
  }

  next();
}

module.exports = { validateCreateRequest };
