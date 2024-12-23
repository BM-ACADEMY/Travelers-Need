const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Sanitize package name
    const packageName = req.body.name
      .replace(/[<>:"/\\|?*\s]+/g, '-') // Replace invalid characters and spaces with hyphens
      .toLowerCase();

    // Define the package-specific folder
    const packageDir = path.join(__dirname, `../uploads/packages/${packageName}`);

    // Create the folder if it doesn't exist
    fs.mkdirSync(packageDir, { recursive: true });

    cb(null, packageDir); // Save files in the package-specific folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Format filename with timestamp and original name
  },
});
// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept image files
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject non-image files
  }
};
// Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB per image
});

module.exports = upload;
