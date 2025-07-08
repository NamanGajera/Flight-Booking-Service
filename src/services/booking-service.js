const axios = require("axios");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const AppError = require("../utils/errors/app-error");
const { BaseError } = require("sequelize");
const { serverConfig } = require("../config");
const { Enums, Messages } = require('../utils/common');

const { STATUS_CODE } = Enums;

async function fetchFlightDetails(flightId) {
    try {
        const response = await axios.get(`${serverConfig.FLIGHT_SERVICE_URL}/flight/${flightId}`);
        return response.data.data;
    } catch (error) {
        if (error.response?.status === STATUS_CODE.NOT_FOUND) {
            throw new AppError("Flight not found", STATUS_CODE.NOT_FOUND);
        }
        throw new AppError("Something went wrong", STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
}

async function createBooking(data) {
    try {
        return await db.sequelize.transaction(async (t) => {
            const flightData = await fetchFlightDetails(data.flightId);

            if (data.noOfSeats > flightData.totalSeats) {
                throw new AppError(
                    Messages.SEATS_EXCEEDED(flightData.totalSeats),
                    STATUS_CODE.BAD_REQUEST
                );
            }

            return { message: "Booking logic to be implemented" };
        });

    } catch (error) {
        if (error instanceof BaseError) {
            const message = error.errors?.[0]?.message || error.message;
            throw new AppError(message, STATUS_CODE.BAD_REQUEST);
        }

        // Rethrow AppErrors as is
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Something went wrong", STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createBooking,
    fetchFlightDetails,
};
