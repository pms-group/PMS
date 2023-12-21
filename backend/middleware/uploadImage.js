const path = require('path');
const multer = require('multer');
const fs = require('fs');

const uploadDirectory = './backend/uploads';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const ext = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (ext && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images with .jpeg, .jpg, or .png extensions are allowed.'));
    }
  };

  const upload = multer({
    storage,
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    fileFilter,
  });

  module.exports = upload;