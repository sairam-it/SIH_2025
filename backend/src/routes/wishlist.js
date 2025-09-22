const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlist
} = require('../controllers/wishlistController');

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/:destinationId', addToWishlist);
router.delete('/:destinationId', removeFromWishlist);
router.delete('/', clearWishlist);
router.get('/check/:destinationId', checkWishlist);

module.exports = router;