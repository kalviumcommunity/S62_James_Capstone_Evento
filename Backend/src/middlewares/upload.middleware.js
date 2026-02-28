const multer = require('multer');
const path = require('path');

// Use memoryStorage — files never touch disk.
// Uploading to Cloudinary happens directly from req.file.buffer.
// This avoids the uploads/ folder entirely and works on ephemeral filesystems (Render).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB hard limit on server side
});

module.exports = upload;
