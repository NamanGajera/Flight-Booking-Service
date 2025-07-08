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
        // console.log("flight Data", flight);
        SuccessResponse.data = flight;
        SuccessResponse.message = "Successfully flight booked";
        return res.status(STATUS_CODE.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        res.status(error.statusCode || 500).json(ErrorResponse);
    }
}

module.exports = {
    createBooking,
}