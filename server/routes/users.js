const express = require('express')
const { updateUser, deleteUser, getUser, getUsers, updateImage, deleteUserImage } = require('../controllers/userController')
const { verifyUser, verifyAdmin } = require('../middleware/verifyJWT')
const upload = require('../config/multer')

const router = express.Router()

// Update
router.put('/:id', verifyUser, updateUser)

// Update img
router.put('/updateImg/:id', upload.single('image'), verifyUser, updateImage)

// Delete
router.delete('/:id', verifyUser, deleteUser)

// Delete
router.delete('/deleteImage/:id', verifyUser, deleteUserImage)

// Get one
router.get('/:id', verifyUser, getUser)

// Get all
router.get('/', verifyAdmin, getUsers)

module.exports = router