const { Enums, Messages } = require("../utils/common");
const { Booking } = require("../models");
const CrudRepository = require("./crud-repository");
const AppError = require("../utils/errors/app-error");
const { Op } = require("sequelize");

const { STATUS_CODE, BOOKING_STATUS } = Enums;

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data, transaction) {
    const response = await Booking.create(data, { transaction: transaction });
    return response;
  }

  async get(data, transaction) {
    const response = await Booking.findByPk(data, { transaction: transaction });
    if (!response) {
      throw new AppError(Messages.BOOKING_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    return response;
  }

  async update(id, data, transaction) {
    const [updatedCount] = await Booking.update(data, {
      where: { id: id },
    }, { transaction: transaction, });

    if (updatedCount === 0) {
      throw new AppError(Messages.DATA_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    const updatedRecord = await Booking.findByPk(id);
    return updatedRecord;
  }

  async getAllUserBooking(userId) {
    const response = await Booking.findAll({ where: { userId: userId }, });
    return response;
  }

  async cancelOldBookings() {
    const fiveMinutesAgo = new Date(Date.now() - (1000 * 60));

    await Booking.update(
      {
        status: BOOKING_STATUS.CANCELLED
      },
      {
        where: {
          createdAt: { [Op.lt]: fiveMinutesAgo },
          status: {
            [Op.notIn]: [BOOKING_STATUS.BOOKED, BOOKING_STATUS.CANCELLED, BOOKING_STATUS.CONFIRMED,]
          }
        }
      },
    );
    return true;
  }

  async findOldPendingBookings() {
    const fiveMinutesAgo = new Date(Date.now() - (1000 * 60));

    const response = await Booking.findAll({
      where: {
        createdAt: { [Op.lt]: fiveMinutesAgo },
        status: {
          [Op.notIn]: [BOOKING_STATUS.BOOKED, BOOKING_STATUS.CANCELLED, BOOKING_STATUS.CONFIRMED,]
        }
      },
      raw: true,
    });
    return response;
  }
}

module.exports = BookingRepository;
