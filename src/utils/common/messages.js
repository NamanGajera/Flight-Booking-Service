
const Messages = {
    SEATS_EXCEEDED: (availableSeats) =>
        `Only ${availableSeats} seat${availableSeats === 1 ? '' : 's'} are available. Please reduce your selection.`,
};

module.exports = Messages;