const Messages = {
  SEATS_EXCEEDED: (availableSeats) =>
    `Only ${availableSeats} seat${availableSeats === 1 ? "" : "s"
    } are available. Please reduce your selection.`,
  REQUIRED_FIELD: (field) => `${field} is required`,
  REQUIRED_BODY: "Request body is required",
  SEAT_BOOKING_MIN_LIMIT: "Number of seats must be at least 1.",
  BOOKING_NOT_FOUND: "Booking not found",
  PAYMENT_AMOUNT_MATCH_ERROR: "Payment amount does not match booking total cost",
  SOMETHING_WRONG: "Something went wrong, please try again later.",
  FLIGHT_NOT_FOUND: "Flight not found",
  NOT_AUTHORIZED: "You are not authorized",
  DATA_NOT_FOUND: "Data not found",
  PAYMENT_AMOUNT_NOT_NEGATIVE: "Payment amount must be greater than zero.",
  PAYMENT_ALREADY_DONE: "Payment has already been made for this booking.",
  PAYMENT_TIME_OVER: "Payment window has expired. Please rebook.",
};

module.exports = Messages;
