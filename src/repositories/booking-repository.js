const { Enums } = require('../utils/common');
const { Booking } = require("../models");
const CrudRepository = require('./crud-repository');

const { STATUS_CODE } = Enums;

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }
}

module.exports = BookingRepository;