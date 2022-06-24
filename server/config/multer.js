const multer = require('multer')

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg'
        ) {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error('file does not support'))
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 3,
    },
})