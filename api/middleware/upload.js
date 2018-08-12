const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}_${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || 'image/png') {
    cb(null, true);
  } else { 
    cb(null, false);
  }
}

upload = multer({storage, fileFilter });

module.exports = upload.single('picture');