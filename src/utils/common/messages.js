const Messages = {
  SEATS_EXCEEDED: (availableSeats) =>
    `Only ${availableSeats} seat${
      availableSeats === 1 ? "" : "s"
    } are available. Please reduce your selection.`,
  REQUIRED_FIELD: (field) => `${field} is required`,
  REQUIRED_BODY: "Request body is required",
  SEAT_BOOKING_MIN_LIMIT: "Number of seats must be at least 1.",
};

module.exports = Messages;
