const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createError } = require('../utils/error')

// Register

module.exports.register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        const { isAdmin, refreshToken, _id, img, ...otherDetails } = req.body
        const newUser = new User({
            ...otherDetails,
            password: hash
        })

        await newUser.save()
        res.status(200).send('User has been created')
    } catch (err) {
        next(err)
    }
}

// Login
module.exports.login = async (req, res, next) => {

    try {
        const cookies = req.cookies

        const user = await User.findOne({ username: req.body.username })
        if (!user) return next(createError(404, 'User not found'))

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordCorrect) return next(createError(400, "Wrong password or username"))

        const { password, isAdmin, email, lastname, createdAt, updatedAt, country, img, city, address, refreshToken, ...otherDetails } = user._doc
        const accessToken = jwt.sign({
            details: { ...otherDetails }, isAdmin: isAdmin
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })

        const newRefreshToken = jwt.sign({
            details: { ...otherDetails }, isAdmin: isAdmin
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

        // Changed to let keyword
        let newRefreshTokenArray = !cookies?.jwt ? user.refreshToken : user.refreshToken.filter(rt => rt !== cookies.jwt)

        if (cookies?.jwt) {
            const refreshToken = cookies.jwt
            const foundToken = await User.findOne({ refreshToken }).exec()

            // Detected refresh token reuse
            if (!foundToken) {
                console.log('attempted refresh token reuse at login')
                newRefreshToken = []
            }

            res.clearCookie('jwt', { httpOnly: true })
        }

        // Saving refreshToken with current user
        user.refreshToken = [...newRefreshTokenArray, newRefreshToken]
        const result = await user.save()

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }).json({ accessToken })


    } catch (err) {
        next(err)
    }

}

// Logout
module.exports.logout = async (req, res, next) => {

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt

    // Is refreshToken in db?
    const user = await User.findOne({ refreshToken }).exec()
    if (!user) {
        res.clearCookie('jwt', { httpOnly: true })
        return res.sendStatus(204)
    }

    // Delete refreshToken in db
    user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken)
    const result = await user.save()

    res.clearCookie('jwt', { httpOnly: true })
    res.sendStatus(204)
}