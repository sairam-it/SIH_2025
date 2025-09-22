const Destination = require('../models/Destination');

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
exports.getDestinations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      state,
      search,
      sort = 'createdAt'
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Add filters
    if (category) {
      query.category = category;
    }

    if (state) {
      query.state = new RegExp(state, 'i');
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    let sortObj = {};
    if (sort === 'rating') {
      sortObj = { 'rating.average': -1 };
    } else if (sort === 'name') {
      sortObj = { name: 1 };
    } else {
      sortObj = { createdAt: -1 };
    }

    // Execute query
    const destinations = await Destination.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await Destination.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: destinations.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: destinations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
exports.getDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id).select('-__v');

    if (!destination || !destination.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get destinations by category
// @route   GET /api/destinations/category/:category
// @access  Public
exports.getDestinationsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const destinations = await Destination.find({
      category: category.toLowerCase(),
      isActive: true
    })
      .sort({ 'rating.average': -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Destination.countDocuments({
      category: category.toLowerCase(),
      isActive: true
    });

    res.status(200).json({
      status: 'success',
      results: destinations.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: destinations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular destinations
// @route   GET /api/destinations/popular
// @access  Public
exports.getPopularDestinations = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const destinations = await Destination.find({ isActive: true })
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      status: 'success',
      results: destinations.length,
      data: destinations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get destinations by state
// @route   GET /api/destinations/state/:state
// @access  Public
exports.getDestinationsByState = async (req, res, next) => {
  try {
    const { state } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const destinations = await Destination.find({
      state: new RegExp(state, 'i'),
      isActive: true
    })
      .sort({ 'rating.average': -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Destination.countDocuments({
      state: new RegExp(state, 'i'),
      isActive: true
    });

    res.status(200).json({
      status: 'success',
      results: destinations.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: destinations
    });
  } catch (error) {
    next(error);
  }
};