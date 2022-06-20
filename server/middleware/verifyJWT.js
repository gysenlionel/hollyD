const jwt = require('jsonwebtoken')


module.exports.verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json("No authenticated")
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json("Invalid token")
            req.user = decoded
            next()
        }
    )
}

// Verify if user is user or admin to modify her own profile
module.exports.verifyUser = (req, res, next) => {
    this.verifyToken(req, res, () => {
        if (req.user.details._id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json("You are not authorized")
        }
    })
}

// Verify admin
module.exports.verifyAdmin = (req, res, next) => {
    this.verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json("You are not authorized")
        }
    })
}