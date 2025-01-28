const multer = require('multer');
const path = require('path');

// Multer Configuration for Profile Photo Uploads
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

module.exports = upload;