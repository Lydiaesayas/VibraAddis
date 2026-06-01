const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Check if valid Cloudinary credentials exist
const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                     process.env.CLOUDINARY_CLOUD_NAME !== 'mock_cloud_name' &&
                     process.env.CLOUDINARY_CLOUD_NAME.trim() !== '';

let storage;

if (hasCloudinary) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'vibraaddis',
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp4'],
    },
  });
} else {
  // Fallback to local storage
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const multerUpload = multer({ storage: storage });

const upload = {
  single: (fieldname) => {
    const originalMiddleware = multerUpload.single(fieldname);
    return (req, res, next) => {
      originalMiddleware(req, res, (err) => {
        if (err) return next(err);
        if (req.file && !hasCloudinary) {
          const baseUrl = `${req.protocol}://${req.get('host')}`;
          req.file.path = `${baseUrl}/uploads/${req.file.filename}`;
        }
        next();
      });
    };
  }
};

module.exports = upload;

