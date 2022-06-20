const express = require('express')
const router = express.Router()
const { register, login, logout } = require('../controllers/authController')
const { handleRefreshToken } = require('../controllers/refreshTokenController')
const { verifyToken, verifyUser } = require('../middleware/verifyJWT')

// Register
router.post('/register', register)

// Login
router.post('/login', login)

// Logout
router.get('/logout', logout)

// RefreshToken
router.get('/', handleRefreshToken)

// Test token, user, admin
// router.get('/token', verifyToken, (req, res, next) => {
//     return res.send('hello, you are logged in')
// })

// router.get('/verifyUser/:id', verifyUser, (req, res, next) => {
//     return res.send('hello, you can delete your account')
// })

// router.get('/verifyAdmin', verifyUser, (req, res, next) => {
//     return res.send('hello, you are admin')
// })

module.exports = router