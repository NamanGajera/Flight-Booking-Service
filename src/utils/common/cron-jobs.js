const crons = require("node-cron");
const { BookingService } = require("../../services");


function scheduledCrons() {
    crons.schedule("*/20 * * * *", async () => {
        await BookingService.cancelOldBookings();
    });
}

module.exports = {
    scheduledCrons,
}