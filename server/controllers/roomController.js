const Room = require('../model/Room')
const Hotel = require('../model/Hotel')

// Create
module.exports.createRoom = async (req, res, next) => {

    const hotelId = req.params.hotelId
    const newRoom = new Room(req.body)

    try {
        const savedRoom = await newRoom.save()
        try {
            await Hotel.findByIdAndUpdate(hotelId, { $push: { rooms: savedRoom._id } })
        } catch (err) {
            next(err)
        }
        res.status(200).json(savedRoom)
    } catch (err) {
        next(err)
    }
}

// Update
module.exports.updateRoom = async (req, res, next) => {
    try {
        const updateRoom = await Room.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true })
        res.status(200).json(updateRoom)
    } catch (err) {
        next(err)
    }
}

// Update availability
module.exports.updateRoomAvailability = async (req, res, next) => {
    try {
        await Room.updateOne({ "roomNumbers._id": req.params.roomNumberId }, {
            $push: {
                "roomNumbers.$.unavailableDates": req.body.dates
            }
        })
        res.status(200).json("Room status has been updated")
    } catch (err) {
        next(err)
    }
}

// Delete
module.exports.deleteRoom = async (req, res, next) => {
    const hotelId = req.params.hotelId

    try {
        await Room.findByIdAndDelete(req.params.id)
        try {
            await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: req.params.id } })
        } catch (err) {
            next(err)
        }
        res.status(200).json("Room has been deleted")
    } catch (err) {
        next(err)
    }
}

// Get one
module.exports.getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id)
        res.status(200).json(room)
    } catch (err) {
        next(err)
    }
}

// Get one roomNumber
module.exports.getRoomNumber = async (req, res, next) => {
    try {
        const room = await Room.findOne({ "roomNumbers._id": req.params.roomNumberId })
        const roomNumber = room.roomNumbers.filter((rm) => rm.id.toString() === req.params.roomNumberId)
        res.status(200).json(roomNumber)
    } catch (err) {
        next(err)
    }
}

// Get all
module.exports.getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find()
        res.status(200).json(rooms)
    } catch (err) {
        next(err)
    }
}