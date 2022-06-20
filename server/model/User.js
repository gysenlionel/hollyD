const mongoose = require('mongoose')
const { isEmail } = require('validator')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [3, 'Username must be contain at least 3 characters'],
        maxlength: 55,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [isEmail],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        max: 1024,
        minlength: [6, 'Password must be contain at least 6 characters']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    firstname: {
        type: String,
        required: [true, 'Firstname is required'],
        minlength: [1, 'Firstname must be contain at least 1 character'],
        maxlength: 55,
        lowercase: true,
    },
    lastname: {
        type: String,
        required: [true, 'Firstname is required'],
        minlength: [1, 'Firstname must be contain at least 1 character'],
        maxlength: 55,
        lowercase: true,
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        minlength: [1, 'Country must be contain at least 1 character'],
        maxlength: 100,
        lowercase: true,
    },
    img: {
        type: String
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        minlength: [1, 'City must be contain at least 1 character'],
        maxlength: 100,
        lowercase: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        minlength: [2, 'Adress must be contain at least 2 characters'],
        maxlength: 100,
        lowercase: true,
    },
    refreshToken: [String]
},
    { timestamps: true }
)

const User = mongoose.model('User', UserSchema)

module.exports = User