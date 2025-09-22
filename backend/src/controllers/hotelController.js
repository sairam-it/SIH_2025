const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const User = require('../models/user');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      state,
      city,
      minPrice,
      maxPrice,
      rating,
      search,
      sort = 'createdAt'
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Add filters
    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseFloat(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    let sortObj = {};
    if (sort === 'rating') {
      sortObj = { rating: -1 };
    } else if (sort === 'price') {
      sortObj = { 'price.amount': 1 };
    } else if (sort === 'name') {
      sortObj = { name: 1 };
    } else {
      sortObj = { createdAt: -1 };
    }

    // Execute query
    const hotels = await Hotel.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await Hotel.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: hotels.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).select('-__v');

    if (!hotel || !hotel.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book a hotel
// @route   POST /api/hotels/:id/book
// @access  Private
exports.bookHotel = async (req, res, next) => {
  try {
    const hotelId = req.params.id;
    const userId = req.user.id;
    const {
      checkIn,
      checkOut,
      guests,
      roomType,
      specialRequests,
      guestDetails
    } = req.body;

    // Check if hotel exists and is active
    const hotel = await Hotel.findById(hotelId);
    if (!hotel || !hotel.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found'
      });
    }

    // Check if room type is available
    const selectedRoomType = hotel.roomTypes.find(room => room.type === roomType);
    if (!selectedRoomType) {
      return res.status(400).json({
        status: 'error',
        message: 'Selected room type is not available'
      });
    }

    if (!selectedRoomType.available) {
      return res.status(400).json({
        status: 'error',
        message: 'Selected room type is currently unavailable'
      });
    }

    // Check room availability for the dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Count existing bookings for the same dates
    const existingBookings = await Booking.countDocuments({
      hotel: hotelId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkIn: { $lte: checkInDate },
          checkOut: { $gt: checkInDate }
        },
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gte: checkOutDate }
        },
        {
          checkIn: { $gte: checkInDate },
          checkOut: { $lte: checkOutDate }
        }
      ]
    });

    if (existingBookings >= hotel.availableRooms) {
      return res.status(400).json({
        status: 'error',
        message: 'No rooms available for the selected dates'
      });
    }

    // Calculate total amount
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = selectedRoomType.price * nights;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      hotel: hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      roomType,
      totalAmount,
      currency: hotel.price?.currency || 'INR',
      specialRequests,
      guestDetails
    });

    // Add booking to user's bookings array
    await User.findByIdAndUpdate(userId, {
      $push: { bookings: booking._id }
    });

    // Populate booking with hotel details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('hotel', 'name location rating images contact')
      .populate('user', 'name email phone');

    res.status(201).json({
      status: 'success',
      message: 'Hotel booked successfully',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/hotels/bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate('hotel', 'name location rating images contact')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/hotels/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const { cancellationReason } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId
    }).populate('hotel', 'name');

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        status: 'error',
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot cancel completed booking'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hotels by location
// @route   GET /api/hotels/location/:state/:city?
// @access  Public
exports.getHotelsByLocation = async (req, res, next) => {
  try {
    const { state, city } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = {
      'location.state': new RegExp(state, 'i'),
      isActive: true
    };

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    const skip = (page - 1) * limit;

    const hotels = await Hotel.find(query)
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Hotel.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: hotels.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};