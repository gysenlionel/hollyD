const Hotel = require('../model/Hotel')
const Room = require('../model/Room')
const Photo = require('../model/Photo')
const { cloudinary } = require("../config/cloudinary")

// Create
module.exports.createHotel = async (req, res, next) => {

    const { photos, ...otherDetails } = req.body
    if (req.body?.photos) {
        try {
            const images = req.body.photos
            let promises = []
            images.forEach(async image => {
                promises.push(
                    cloudinary.uploader.upload(image, {
                        folder: 'photos-hotel'
                    })
                )
            })
            // Array of data photos
            const response = await Promise.all(promises)
            let savedPhotosArray = []
            await Promise.all(response.map(async res => {
                const hotelPhoto = {
                    url: res.url,
                    public_id: res.public_id
                }
                const newPhoto = new Photo(hotelPhoto)

                try {
                    const savedPhoto = await newPhoto.save()
                    savedPhotosArray.push(savedPhoto)
                } catch (err) {
                    next(err)
                }

            }))

            try {
                const photosId = savedPhotosArray.map(e => e._id)
                const objPhotosId = { photos: photosId }
                const dataHotel = Object.assign(otherDetails, objPhotosId)
                const newHotel = new Hotel(dataHotel)
                try {
                    const savedHotel = await newHotel.save()
                    res.status(200).json(savedHotel)
                } catch (err) {
                    next(err)
                }

            } catch (err) {
                next(err)
            }

        } catch (err) {
            next(err)
        }
    } else {
        const newHotel = new Hotel(otherDetails)

        try {
            const savedHotel = await newHotel.save()
            res.status(200).json(savedHotel)
        } catch (err) {
            next(err)
        }
    }
}

// Update
module.exports.updateHotel = async (req, res, next) => {
    const { photos, ...otherDetails } = req.body
    try {
        const updateHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: otherDetails }, { new: true, runValidators: true })
        res.status(200).json(updateHotel)
    } catch (err) {
        next(err)
    }
}

// Update Photos
module.exports.updatePhotosHotel = async (req, res, next) => {
    try {
        const images = req.body.photos
        let promises = []
        images.forEach(async image => {
            promises.push(
                cloudinary.uploader.upload(image, {
                    folder: 'photos-hotel'
                })
            )
        })
        // Array of data photos
        const response = await Promise.all(promises)
        let savedPhotosArray = []
        await Promise.all(response.map(async res => {
            const hotelPhoto = {
                url: res.url,
                public_id: res.public_id
            }
            const newPhoto = new Photo(hotelPhoto)

            try {
                const savedPhoto = await newPhoto.save()
                savedPhotosArray.push(savedPhoto)
            } catch (err) {
                next(err)
            }

        }))

        try {
            const photosId = savedPhotosArray.map(e => e._id)
            const objPhotosId = { photos: photosId }

            try {
                const updateHotel = await Hotel.findByIdAndUpdate(req.params.id, { $push: objPhotosId }, { new: true })
                res.status(200).json(updateHotel)
            } catch (err) {
                next(err)
            }

        } catch (err) {
            next(err)
        }

    } catch (err) {
        next(err)
    }
}

// Delete Photo hotel
module.exports.deletePhotoHotel = async (req, res, next) => {
    try {
        const photo = await Photo.findById(req.params.photoId)
        await cloudinary.uploader.destroy(photo.public_id)
        const hotel = await Hotel.findById(req.params.hotelId)
        let filterArray = await Promise.all(hotel.photos.filter((img => img !== photo._id.toString())))

        const updateHotel = await Hotel.findByIdAndUpdate(req.params.hotelId, { $set: { 'photos': filterArray } }, { new: true })
        const deletePhoto = await Photo.findByIdAndDelete(req.params.photoId)
        res.status(200).json('Photo has been deleted')
    } catch (err) {
        next(err)
    }
}

// Delete
module.exports.deleteHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
        if (hotel?.photos) {
            // Delete photos in cloudinary and model Photo
            try {
                const photos = await Photo.find({ _id: { $in: hotel.photos } });
                photos.forEach(async photo => {
                    cloudinary.uploader.destroy(photo.public_id)
                    const deletePhoto = await Photo.findByIdAndDelete(photo._id)
                })
                const deleteHotel = await Hotel.findByIdAndDelete(req.params.id)
                res.status(200).json('Hotel has been deleted')
            } catch (err) {
                next(err)
            }

        } else {
            const deleteHotel = await Hotel.findByIdAndDelete(req.params.id)
            res.status(200).json('Hotel has been deleted')
        }
    } catch (err) {
        next(err)
    }
}

// Get one
module.exports.getHotel = async (req, res, next) => {
    try {
        let hotel = await Hotel.findById(req.params.id)
        const images = await Photo.find({ _id: { $in: hotel.photos } });
        const { photos, ...otherDetailsHotel } = hotel._doc
        const dataHotel = {
            photos: images, ...otherDetailsHotel
        }
        res.status(200).json(dataHotel)
    } catch (err) {
        next(err)
    }
}

// Get all
module.exports.getHotels = async (req, res, next) => {
    const { min, max, ...others } = req.query
    try {
        const hotels = await Hotel.find({
            ...others,
            cheapestPrice: { $gte: min || 1, $lte: max || 999 }
        }).limit(req.query.limit)

        let dataHotels = []
        await Promise.all(hotels.map(async hotel => {
            const images = await Photo.find({ _id: { $in: hotel.photos } });
            const { photos, ...otherDetailsHotel } = hotel._doc
            const dataHotel = {
                photos: images, ...otherDetailsHotel
            }
            dataHotels.push(dataHotel)
        }))

        res.status(200).json(dataHotels)
    } catch (err) {
        next(err)
    }
}

// Get count by city
module.exports.countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(',')
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city: city })
        }))
        res.status(200).json(list)
    } catch (err) {
        next(err)
    }
}

// Get count by type
module.exports.countByType = async (req, res, next) => {

    try {
        const hotelCount = await Hotel.countDocuments({ type: "hotel" })
        const appartementCount = await Hotel.countDocuments({ type: "appartment" })
        const resortCount = await Hotel.countDocuments({ type: "resort" })
        const villaCount = await Hotel.countDocuments({ type: "villa" })
        const cabinCount = await Hotel.countDocuments({ type: "cabin" })
        res.status(200).json([
            { type: "hotels", count: hotelCount },
            { type: "appartments", count: appartementCount },
            { type: "resorts", count: resortCount },
            { type: "villas", count: villaCount },
            { type: "cabins", count: cabinCount },
        ])
    } catch (err) {
        next(err)
    }
}

// Get rooms of Hotel
module.exports.getHotelRooms = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
        const list = await Promise.all(hotel.rooms.map(room => {
            return Room.findById(room)
        }))
        res.status(200).json(list)
    } catch (err) {
        next(err)
    }
}