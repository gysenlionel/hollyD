const User = require('../model/User')
const Photo = require('../model/Photo')
const { cloudinary } = require("../config/cloudinary")
const { createError } = require('../utils/error')

// Update
module.exports.updateUser = async (req, res, next) => {
    const { isAdmin, password, refreshToken, _id, createdAt, updatedAt, img, username, ...Details } = req.body
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: Details }, { new: true, runValidators: true, })
        const { password, refreshToken, ...otherDetails } = updateUser._doc
        res.status(200).json(otherDetails)
    } catch (err) {
        next(err)
    }
}

// Update image
module.exports.updateImage = async (req, res, next) => {
    try {
        if (!req.file) return next(createError(400, "No file"))

        // remove old image of cloudinary and Photo model
        const user = await User.findById(req.params.id)
        if (user.img) {
            const photo = await Photo.findById(user.img)
            cloudinary.uploader.destroy(photo.public_id)
            const deletePhoto = await Photo.findByIdAndDelete(photo._id)
        }

        // add image
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'photos-users'
        })
        const userImg = {
            url: result.url,
            public_id: result.public_id
        }

        const newPhoto = new Photo(userImg)
        const savedPhoto = await newPhoto.save()

        const { _id } = savedPhoto
        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: { 'img': _id } }, { new: true })
        const { password, refreshToken, img, ...otherDetails } = updateUser._doc

        const photo = await Photo.findById(img)

        const objUser = {
            img: photo,
            ...otherDetails
        }
        res.status(200).json(objUser)
    } catch (err) {
        next(err)
    }
}

// Delete
module.exports.deleteUser = async (req, res, next) => {
    try {

        // remove image of cloudinary and Photo model
        const user = await User.findById(req.params.id)
        if (user.img) {
            const photo = await Photo.findById(user.img)
            cloudinary.uploader.destroy(photo.public_id)
            const deletePhoto = await Photo.findByIdAndDelete(photo._id)
        }

        const deleteUser = await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been deleted')
    } catch (err) {
        next(err)
    }
}

// Delete image
module.exports.deleteUserImage = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (user.img) {
            const photo = await Photo.findById(user.img)
            cloudinary.uploader.destroy(photo.public_id)
            const deletePhoto = await Photo.findByIdAndDelete(photo._id)
            const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: { 'img': '' } }, { new: true })
            res.status(200).json('Photo has been deleted')
        } else {
            res.status(404).json('No image to delete')
        }
    } catch (err) {
        next(err)
    }
}

// Get one
module.exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        const photo = await Photo.findById(user.img)
        const { password, refreshToken, img, ...otherDetails } = user._doc

        const objUser = {
            img: photo,
            ...otherDetails
        }

        res.status(200).json(objUser)
    } catch (err) {
        next(err)
    }
}

// Get all
module.exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        const usersWithoutToken = await Promise.all(users.map(async u => {
            const { password, refreshToken, img, ...otherDetails } = u._doc
            if (u.img) {
                const photo = await Photo.findById(u.img)
                const objUser = {
                    img: photo,
                    ...otherDetails
                }
                return objUser
            } else {

                return otherDetails
            }
        }))
        res.status(200).json(usersWithoutToken)
    } catch (err) {
        next(err)
    }
}