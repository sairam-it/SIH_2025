const express = require('express');
const { protect, optionalAuth } = require('../middlewares/auth');
const { validate, bookingSchema } = require('../middlewares/validation');
const {
  getHotels,
  getHotel,
  bookHotel,
  getUserBookings,
  cancelBooking,
  getHotelsByLocation
} = require('../controllers/hotelController');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getHotels);
router.get('/location/:state/:city?', optionalAuth, getHotelsByLocation);
router.get('/:id', optionalAuth, getHotel);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.post('/:id/book', validate(bookingSchema), bookHotel);
router.get('/bookings/my', getUserBookings);
router.put('/bookings/:id/cancel', cancelBooking);

module.exports = router;