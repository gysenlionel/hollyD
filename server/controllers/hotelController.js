const Hotel = require('../model/Hotel')
const Room = require('../model/Room')

// Create
module.exports.createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body)

    try {
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    } catch (err) {
        next(err)
    }
}

// Update
module.exports.updateHotel = async (req, res, next) => {
    try {
        const updateHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true })
        res.status(200).json(updateHotel)
    } catch (err) {
        next(err)
    }
}

// Delete
module.exports.deleteHotel = async (req, res, next) => {
    try {
        const deleteHotel = await Hotel.findByIdAndDelete(req.params.id)
        res.status(200).json('Hotel has been deleted')
    } catch (err) {
        next(err)
    }
}

// Get one
module.exports.getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
        res.status(200).json(hotel)
    } catch (err) {
        next(err)
    }
}

// Get all
module.exports.getHotels = async (req, res, next) => {
    const { min, max, ...others } = req.query
    try {
        const hotels = await Hotel.find({
            ...others,
            cheapestPrice: { $gte: min || 1, $lte: max || 999 }
        }).limit(req.query.limit)
        res.status(200).json(hotels)
    } catch (err) {
        next(err)
    }
}

// Get count by city
module.exports.countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(',')
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city: city })
        }))
        res.status(200).json(list)
    } catch (err) {
        next(err)
    }
}

// Get count by type
module.exports.countByType = async (req, res, next) => {

    try {
        const hotelCount = await Hotel.countDocuments({ type: "hotel" })
        const appartementCount = await Hotel.countDocuments({ type: "appartment" })
        const resortCount = await Hotel.countDocuments({ type: "resort" })
        const villaCount = await Hotel.countDocuments({ type: "villa" })
        const cabinCount = await Hotel.countDocuments({ type: "cabin" })
        res.status(200).json([
            { type: "hotels", count: hotelCount },
            { type: "appartments", count: appartementCount },
            { type: "resorts", count: resortCount },
            { type: "villas", count: villaCount },
            { type: "cabins", count: cabinCount },
        ])
    } catch (err) {
        next(err)
    }
}

// Get rooms of Hotel
module.exports.getHotelRooms = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
        const list = await Promise.all(hotel.rooms.map(room => {
            return Room.findById(room)
        }))
        res.status(200).json(list)
    } catch (err) {
        next(err)
    }
}