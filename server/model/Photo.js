const mongoose = require('mongoose')

const PhotoSchema = new mongoose.Schema({
    url: String,
    public_id: String
},
    { timestamps: true }
)

const Photo = mongoose.model("Photo", PhotoSchema)

module.exports = Photo