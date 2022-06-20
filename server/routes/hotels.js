const express = require('express')
const { createHotel, updateHotel, deleteHotel, getHotel, getHotels, countByCity, countByType, getHotelRooms } = require('../controllers/hotelController')
const { verifyAdmin } = require('../middleware/verifyJWT')
const router = express.Router()

// Create
router.post('/', verifyAdmin, createHotel)

// Update
router.put('/:id', verifyAdmin, updateHotel)

// Delete
router.delete('/:id', verifyAdmin, deleteHotel)

// Get one
router.get('/find/:id', getHotel)

// Get all
router.get('/', getHotels)

// Get count by city
router.get('/countByCity', countByCity)

// Get count by type
router.get('/countByType', countByType)

// Get rooms of hotel
router.get('/rooms/:id', getHotelRooms)

module.exports = router

