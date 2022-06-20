const express = require('express')
const { updateUser, deleteUser, getUser, getUsers } = require('../controllers/userController')
const { verifyUser, verifyAdmin } = require('../middleware/verifyJWT')
const router = express.Router()

// Update
router.put('/:id', verifyUser, updateUser)

// Delete
router.delete('/:id', verifyUser, deleteUser)

// Get one
router.get('/:id', verifyUser, getUser)

// Get all
router.get('/', verifyAdmin, getUsers)

module.exports = router