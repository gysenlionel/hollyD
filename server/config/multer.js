const multer = require('multer')

// const maxSize = 1 * 1000 * 1000;
module.exports = multer({
    storage: multer.diskStorage({}),
    // limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {

        // The function should call `cb` with a boolean
        // to indicate if the file should be accepted

        if (!file.mimetype.match(/png||jpeg||jpg||gif$i/)) {
            // You can always pass an error if something goes wrong:
            cb(new Error('file does not support'), false)
            return
        }

        // To accept the file pass `true`, like so:
        cb(null, true)
    }
})