const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Ensure uploads directory exists locally
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Cloudinary credentials if present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'), false);
  }
};

// Local Storage Engine
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const localUpload = multer({
  storage: localStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

let cloudinaryUpload;
if (isCloudinaryConfigured) {
  try {
    const cloudStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'ys_investment_consultants',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
      }
    });
    cloudinaryUpload = multer({
      storage: cloudStorage,
      fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }
    });
  } catch (err) {
    console.warn('Failed to initialize Cloudinary storage engine:', err.message);
  }
}

// Wrapper middleware to gracefully handle upload errors
const uploadSingle = (fieldname) => {
  return (req, res, next) => {
    if (isCloudinaryConfigured && cloudinaryUpload) {
      cloudinaryUpload.single(fieldname)(req, res, (err) => {
        if (!err) return next();
        console.warn('Cloudinary upload error, falling back to local storage:', err.message);
        // Fall back to local upload
        localUpload.single(fieldname)(req, res, (localErr) => {
          if (localErr) return res.status(400).json({ message: localErr.message || 'Image upload failed' });
          next();
        });
      });
    } else {
      localUpload.single(fieldname)(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message || 'Image upload failed' });
        next();
      });
    }
  };
};

module.exports = {
  single: uploadSingle
};
