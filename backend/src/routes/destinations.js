const express = require('express');
const { optionalAuth } = require('../middlewares/auth');
const {
  getDestinations,
  getDestination,
  getDestinationsByCategory,
  getPopularDestinations,
  getDestinationsByState
} = require('../controllers/destinationController');

const router = express.Router();

// Public routes with optional authentication
router.get('/', optionalAuth, getDestinations);
router.get('/popular', optionalAuth, getPopularDestinations);
router.get('/category/:category', optionalAuth, getDestinationsByCategory);
router.get('/state/:state', optionalAuth, getDestinationsByState);
router.get('/:id', optionalAuth, getDestination);

module.exports = router;