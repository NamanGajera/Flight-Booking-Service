const axios = require("axios");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const AppError = require("../utils/errors/app-error");
const { BaseError } = require("sequelize");
const { serverConfig } = require("../config");
const { Enums, Messages } = require("../utils/common");

const { STATUS_CODE, BOOKING_STATUS } = Enums;
const bookingRepository = new BookingRepository();

async function fetchFlightDetails(flightId) {
  try {
    const response = await axios.get(
      `${serverConfig.FLIGHT_SERVICE_URL}/flight/${flightId}`
    );
    return response.data.data;
  } catch (error) {
    if (error.response?.status === STATUS_CODE.NOT_FOUND) {
      throw new AppError(Messages.FLIGHT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    throw new AppError(
      Messages.SOMETHING_WRONG,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateFlightSeats(data) {
  const { flightId, seats, dec } = data;
  try {
    const response = await axios.patch(
      `${serverConfig.FLIGHT_SERVICE_URL}/flight/${flightId}/seats`,
      {
        seats,
        dec,
      }
    );
    return response.data.data;
  } catch (error) {
    if (error.response?.status === STATUS_CODE.NOT_FOUND) {
      throw new AppError(Messages.FLIGHT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    throw new AppError(
      Messages.SOMETHING_WRONG,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}

async function createBooking(data) {
  const { flightId, noOfSeats, userId } = data;
  const transaction = await db.sequelize.transaction();
  try {
    const flightData = await fetchFlightDetails(flightId);

    if (noOfSeats > flightData.totalSeats) {
      throw new AppError(
        Messages.SEATS_EXCEEDED(flightData.totalSeats),
        STATUS_CODE.BAD_REQUEST
      );
    }
    const totalAmount = noOfSeats * flightData.price;
    const bookingPayload = { ...data, totalCost: totalAmount };

    const booking = bookingRepository.createBooking(
      bookingPayload,
      transaction
    );

    await updateFlightSeats({ flightId, seats: noOfSeats });

    await await transaction.commit();
    return booking;
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    if (error instanceof BaseError) {
      const message = error.errors?.[0]?.message || error.message;
      throw new AppError(message, STATUS_CODE.BAD_REQUEST);
    }

    // Rethrow AppErrors as is
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      Messages.SOMETHING_WRONG,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}

async function makePayment(data) {
  const { bookingId, amount, userId } = data;
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(bookingId, transaction);
    if (bookingDetails.totalCost !== amount) {
      throw new AppError(
        Messages.PAYMENT_AMOUNT_MATCH_ERROR,
        STATUS_CODE.BAD_REQUEST
      );
    }
    if (bookingDetails.userId !== userId) {
      throw new AppError(
        Messages.NOT_AUTHORIZED,
        STATUS_CODE.UNAUTHORIZED
      );
    }

    if (bookingDetails.status === BOOKING_STATUS.BOOKED) {
      throw new AppError(
        Messages.PAYMENT_ALREADY_DONE,
        STATUS_CODE.NOT_FOUND
      );
    }

    const createdAt = new Date(bookingDetails.createdAt);

    const now = new Date();
    const diffInMinutes = (now - createdAt) / (1000 * 60);

    if (diffInMinutes > 5) {
      await cancelBooking(bookingDetails);
      throw new AppError(
        Messages.PAYMENT_TIME_OVER,
        STATUS_CODE.BAD_REQUEST
      );
    }
    const response = await bookingRepository.update(bookingId, { status: BOOKING_STATUS.BOOKED }, transaction);
    await transaction.commit();
    return response;
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    if (error instanceof BaseError) {
      const message = error.errors?.[0]?.message || error.message;
      throw new AppError(message, STATUS_CODE.BAD_REQUEST);
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      Messages.SOMETHING_WRONG,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}

async function cancelBooking(bookingData) {
  const transaction = await db.sequelize.transaction();
  try {
    if (bookingData.status === BOOKING_STATUS.CANCELLED) {
      transaction.commit();
      return true;
    }
    await updateFlightSeats({ flightId: bookingData.flightId, seats: bookingData.noOfSeats, dec: false });
    await bookingRepository.update(bookingData.id, { status: BOOKING_STATUS.CANCELLED }, transaction);
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof BaseError) {
      const message = error.errors?.[0]?.message || error.message;
      throw new AppError(message, STATUS_CODE.BAD_REQUEST);
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      Messages.SOMETHING_WRONG,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllUserBooking(data) {
  try {
    const { userId } = data;
    const bookingData = await bookingRepository.getAllUserBooking(userId);
    return bookingData;
  } catch (error) {
    console.log(error);
    if (error instanceof BaseError) {
      const message = error.errors?.[0]?.message || error.message;
      throw new AppError(message, STATUS_CODE.BAD_REQUEST);
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      Messages.SOMETHING_WRONG,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}

async function cancelOldBookings() {
  try {
    const pendingBookingData = await bookingRepository.findOldPendingBookings();
    const response = await bookingRepository.cancelOldBookings();
    console.log("pendingBookingData", pendingBookingData);
    for (const bookingData of pendingBookingData) {
      await cancelBooking(bookingData);
    }
    return response;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createBooking,
  fetchFlightDetails,
  makePayment,
  getAllUserBooking,
  cancelOldBookings,
};
