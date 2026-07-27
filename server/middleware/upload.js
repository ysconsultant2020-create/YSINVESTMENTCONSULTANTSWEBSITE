const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Ensure uploads directory exists locally
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Cloudinary credentials if present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim()
  });
}

const isCloudinaryConfigured = () => !!(
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

// Memory storage engine (parses request stream ONCE)
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to upload single file
const uploadSingle = (fieldname) => {
  return (req, res, next) => {
    memoryUpload.single(fieldname)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message || 'File upload error' });
      }

      if (!req.file) {
        return next();
      }

      const ext = path.extname(req.file.originalname) || '.png';
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;

      // If Cloudinary is configured, attempt upload via stream
      if (isCloudinaryConfigured()) {
        try {
          const uploadPromise = new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'ys_investment_consultants',
                public_id: path.basename(uniqueName, ext),
                resource_type: 'auto'
              },
              (cloudErr, result) => {
                if (cloudErr) return reject(cloudErr);
                resolve(result);
              }
            );
            stream.end(req.file.buffer);
          });

          const result = await uploadPromise;
          req.file.path = result.secure_url;
          return next();
        } catch (cloudErr) {
          console.warn('Cloudinary upload error, falling back to local file saving:', cloudErr.message);
        }
      }

      // Local disk fallback
      try {
        const localPath = path.join(uploadsDir, uniqueName);
        fs.writeFileSync(localPath, req.file.buffer);
        req.file.path = `/uploads/${uniqueName}`;
        req.file.filename = uniqueName;
        next();
      } catch (localErr) {
        console.error('Local file write error:', localErr);
        res.status(500).json({ message: 'Failed to save image file' });
      }
    });
  };
};

module.exports = {
  single: uploadSingle
};
