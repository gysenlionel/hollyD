const express = require('express')
const { verifyAdmin, verifyUser } = require('../middleware/verifyJWT')
const { createRoom, updateRoom, updateRoomAvailability, deleteRoom, getRoom, getRooms, getRoomNumber } = require('../controllers/roomController')
const router = express.Router()

// Create
router.post('/:hotelId', verifyAdmin, createRoom)

// Update
router.put('/:id', verifyAdmin, updateRoom)

// Room availability
router.put('/availability/:roomNumberId', verifyUser, updateRoomAvailability)

// Delete
router.delete('/:id/:hotelId', verifyAdmin, deleteRoom)

// Get one
router.get('/:id', getRoom)

// Get one RoomNumber
router.get('/getRoomNumber/:roomNumberId', getRoomNumber)

// Get all
router.get('/', getRooms)

module.exports = router