const User = require('../models/user');
const Destination = require('../models/Destination');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'wishlist',
        match: { isActive: true },
        select: 'name state description category images highlights bestTime duration rating'
      });

    res.status(200).json({
      status: 'success',
      results: user.wishlist.length,
      data: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add destination to wishlist
// @route   POST /api/wishlist/:destinationId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const userId = req.user.id;

    // Check if destination exists and is active
    const destination = await Destination.findById(destinationId);
    if (!destination || !destination.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Destination not found'
      });
    }

    // Check if destination is already in wishlist
    const user = await User.findById(userId);
    if (user.wishlist.includes(destinationId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Destination is already in your wishlist'
      });
    }

    // Add to wishlist
    await User.findByIdAndUpdate(userId, {
      $push: { wishlist: destinationId }
    });

    res.status(200).json({
      status: 'success',
      message: 'Destination added to wishlist successfully',
      data: {
        destinationId,
        destinationName: destination.name
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove destination from wishlist
// @route   DELETE /api/wishlist/:destinationId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const userId = req.user.id;

    // Check if destination is in wishlist
    const user = await User.findById(userId);
    if (!user.wishlist.includes(destinationId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Destination is not in your wishlist'
      });
    }

    // Remove from wishlist
    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: destinationId }
    });

    res.status(200).json({
      status: 'success',
      message: 'Destination removed from wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      $set: { wishlist: [] }
    });

    res.status(200).json({
      status: 'success',
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if destination is in wishlist
// @route   GET /api/wishlist/check/:destinationId
// @access  Private
exports.checkWishlist = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const isInWishlist = user.wishlist.includes(destinationId);

    res.status(200).json({
      status: 'success',
      data: {
        isInWishlist,
        destinationId
      }
    });
  } catch (error) {
    next(error);
  }
};