const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the directory exists
const backendUploadDirectory = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(backendUploadDirectory)) {
  fs.mkdirSync(backendUploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, backendUploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid mime type, only JPEG and PNG are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports = upload;
