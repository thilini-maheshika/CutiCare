const multer = require('multer');
const path = require('path');

const doctorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/profile');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadProfile = multer({ storage: doctorStorage });

module.exports = { uploadProfile };
