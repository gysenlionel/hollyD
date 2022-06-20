const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
    hotelName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    people: {
        type: Number,
        required: true
    },
    roomNumber: {
        type: Number,
        required: true
    },
    dates: [{
        type: Date,
        required: true
    }],
    userId: {
        type: String,
        required: true
    },
    roomNumberId: {
        type: String,
        required: true
    },

},
    { timestamps: true }
)

const Booking = mongoose.model('Booking', BookingSchema)

module.exports = Booking
