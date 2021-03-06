require('dotenv').config()
const express = require('express')
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerJsDocs = YAML.load('./api.yaml')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
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

// Cross Origin Ressource Sharing
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json({ limit: '20mb' }))

// middleware for cookies
app.use(cookieParser())

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')))

// swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs))

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