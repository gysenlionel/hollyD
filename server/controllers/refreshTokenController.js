const User = require('../model/User')
const jwt = require('jsonwebtoken')
const { createError } = require('../utils/error')

const handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return next(createError(401, "No authenticated"))
    const refreshToken = cookies.jwt
    res.clearCookie('jwt', { httpOnly: true })

    const user = await User.findOne({ refreshToken }).exec()

    // Detected refresh token reuse

    if (!user) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403)
                const hackedUser = await User.findOne({ username: decoded.details.username }).exec()
                hackedUser.refreshToken = []
                const result = await hackedUser.save()
            }
        )
        return res.sendStatus(403)
    }

    const newRefreshTokenArray = user.refreshToken.filter(rt => rt !== refreshToken)

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                user.refreshToken = [...newRefreshTokenArray]
                const result = await user.save()
            }
            if (err || user.username !== decoded.details.username) return res.sendStatus(403)

            // Refresh token was still valid
            const { password, isAdmin, email, lastname, createdAt, updatedAt, country, img, city, address, refreshToken, ...otherDetails } = user._doc
            const accessToken = jwt.sign({
                details: { ...otherDetails }, isAdmin: isAdmin
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })

            const newRefreshToken = jwt.sign({
                details: { ...otherDetails }, isAdmin: isAdmin
            }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

            // Saving refreshToken with current user
            user.refreshToken = [...newRefreshTokenArray, newRefreshToken]
            const result = await user.save()

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true })

            res.json({ accessToken })
        }
    )
}

module.exports = { handleRefreshToken }