require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
// const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConnection')
const PORT = process.env.PORT || 8000
const { displayError } = require('./utils/error')
const authRoutes = require('./routes/auth')
const users = require('./routes/users')
const hotels = require('./routes/hotels')
const rooms = require('./routes/rooms')

// Connect to MongoDB
connectDB()

// Handle options credentials check before CORS
// app.use(credentials)

// Cross Origin Ressource Sharing
// configuration CORS
// const whitelist = [process.env.CLIENT_URL, process.env.ADMIN_URL]
const corsOptions = {
    origin: process.env.CLIENT_URL,
    // origin: function (origin, callback) {
    //     if (whitelist.indexOf(origin) !== -1) {
    //         callback(null, true)
    //     } else {
    //         callback(new Error('Not allowed by CORS'))
    //     }
    // },
    credentials: true,
}
app.use(cors(corsOptions))

// built-in middleware for json
app.use(express.json({ limit: '20mb' }))

// middleware for cookies
app.use(cookieParser())

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')))

// routes
app.use('/api/auth', authRoutes)
app.use('/api/users', users)
app.use('/api/hotels', hotels)
app.use('/api/rooms', rooms)


// error custom
displayError(app)

mongoose.connection.once('open', () => {
    console.log(`Connected to MongoDB ✨ ✨`)
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT} 💥 🚀 🌍 👽`))
})