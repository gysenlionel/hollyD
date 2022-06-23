const mongoose = require('mongoose')

const PhotoSchema = new mongoose.Schema([{
    url: String,
    public_id: String
}])

const Photo = mongoose.model("Photo", PhotoSchema)

module.exports = Photo