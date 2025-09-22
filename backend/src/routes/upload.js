const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  uploadImage,
  handleImageUpload,
  uploadMultipleImages,
  handleMultipleImageUpload,
  deleteFile,
  handleMulterError
} = require('../controllers/uploadController');

const router = express.Router();

// All upload routes require authentication
router.use(protect);

// Single image upload
router.post('/image', uploadImage, handleImageUpload);

// Multiple images upload
router.post('/images', uploadMultipleImages, handleMultipleImageUpload);

// Delete file
router.delete('/:filename', deleteFile);

// Error handling for multer
router.use(handleMulterError);

module.exports = router;