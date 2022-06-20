const User = require('../model/User')

// Update
module.exports.updateUser = async (req, res, next) => {
    const { isAdmin, password, refreshToken, _id, createdAt, updatedAt, ...Details } = req.body
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: Details }, { new: true, runValidators: true, })
        const { password, refreshToken, ...otherDetails } = updateUser._doc
        res.status(200).json(otherDetails)
    } catch (err) {
        next(err)
    }
}

// Delete
module.exports.deleteUser = async (req, res, next) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been deleted')
    } catch (err) {
        next(err)
    }
}

// Get one
module.exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, refreshToken, ...otherDetails } = user._doc
        res.status(200).json(otherDetails)
    } catch (err) {
        next(err)
    }
}

// Get all
module.exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        const usersWithoutToken = users.map(u => {
            const { password, refreshToken, ...otherDetails } = u._doc
            return otherDetails
        })
        res.status(200).json(usersWithoutToken)
    } catch (err) {
        next(err)
    }
}