const express = require('express')
const { createHotel, updateHotel, deleteHotel, getHotel, getHotels, countByCity, countByType, getHotelRooms, updatePhotosHotel, deletePhotoHotel } = require('../controllers/hotelController')
const { verifyAdmin } = require('../middleware/verifyJWT')
const router = express.Router()

// Create
router.post('/', createHotel)

// Update
router.put('/:id', verifyAdmin, updateHotel)

// Update Photos hotel
router.put('/updatePhoto/:id', updatePhotosHotel)

// Delete Photo hotel
router.delete('/deletePhoto/:hotelId/:photoId', deletePhotoHotel)

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

