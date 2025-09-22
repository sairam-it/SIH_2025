const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');

// @desc    Unified search for destinations and hotels
// @route   GET /api/search
// @access  Public
exports.search = async (req, res, next) => {
  try {
    const {
      q,
      type = 'all', // 'destinations', 'hotels', 'all'
      category,
      state,
      city,
      minPrice,
      maxPrice,
      rating,
      page = 1,
      limit = 10
    } = req.query;

    const results = {};
    const skip = (page - 1) * limit;

    // Search destinations
    if (type === 'destinations' || type === 'all') {
      const destinationQuery = { isActive: true };

      // Add search text
      if (q) {
        destinationQuery.$text = { $search: q };
      }

      // Add filters
      if (category) {
        destinationQuery.category = category.toLowerCase();
      }

      if (state) {
        destinationQuery.state = new RegExp(state, 'i');
      }

      if (rating) {
        destinationQuery['rating.average'] = { $gte: parseFloat(rating) };
      }

      const destinations = await Destination.find(destinationQuery)
        .sort(q ? { score: { $meta: 'textScore' } } : { 'rating.average': -1 })
        .skip(type === 'all' ? 0 : skip)
        .limit(type === 'all' ? 5 : parseInt(limit))
        .select('name state description category images highlights bestTime duration rating');

      const destinationTotal = await Destination.countDocuments(destinationQuery);

      results.destinations = {
        data: destinations,
        total: destinationTotal,
        count: destinations.length
      };
    }

    // Search hotels
    if (type === 'hotels' || type === 'all') {
      const hotelQuery = { isActive: true };

      // Add search text
      if (q) {
        hotelQuery.$text = { $search: q };
      }

      // Add filters
      if (state) {
        hotelQuery['location.state'] = new RegExp(state, 'i');
      }

      if (city) {
        hotelQuery['location.city'] = new RegExp(city, 'i');
      }

      if (minPrice || maxPrice) {
        hotelQuery['price.amount'] = {};
        if (minPrice) hotelQuery['price.amount'].$gte = parseFloat(minPrice);
        if (maxPrice) hotelQuery['price.amount'].$lte = parseFloat(maxPrice);
      }

      if (rating) {
        hotelQuery.rating = { $gte: parseFloat(rating) };
      }

      const hotels = await Hotel.find(hotelQuery)
        .sort(q ? { score: { $meta: 'textScore' } } : { rating: -1 })
        .skip(type === 'all' ? 0 : skip)
        .limit(type === 'all' ? 5 : parseInt(limit))
        .select('name location description rating price images amenities');

      const hotelTotal = await Hotel.countDocuments(hotelQuery);

      results.hotels = {
        data: hotels,
        total: hotelTotal,
        count: hotels.length
      };
    }

    // Calculate pagination for specific type searches
    let pagination = {};
    if (type !== 'all') {
      const total = type === 'destinations' ? results.destinations?.total : results.hotels?.total;
      pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      };
    }

    res.status(200).json({
      status: 'success',
      query: q,
      type,
      ...(type !== 'all' && { pagination }),
      results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.length < 2) {
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }

    const suggestions = [];

    // Get destination suggestions
    const destinations = await Destination.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { state: new RegExp(q, 'i') },
        { highlights: new RegExp(q, 'i') }
      ],
      isActive: true
    })
      .limit(parseInt(limit))
      .select('name state category');

    destinations.forEach(dest => {
      suggestions.push({
        type: 'destination',
        id: dest._id,
        name: dest.name,
        subtitle: `${dest.state} • ${dest.category}`,
        category: dest.category
      });
    });

    // Get hotel suggestions
    const hotels = await Hotel.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { 'location.city': new RegExp(q, 'i') },
        { 'location.state': new RegExp(q, 'i') }
      ],
      isActive: true
    })
      .limit(parseInt(limit))
      .select('name location rating');

    hotels.forEach(hotel => {
      suggestions.push({
        type: 'hotel',
        id: hotel._id,
        name: hotel.name,
        subtitle: `${hotel.location.city}, ${hotel.location.state} • ${hotel.rating}★`,
        rating: hotel.rating
      });
    });

    // Limit total suggestions
    const limitedSuggestions = suggestions.slice(0, parseInt(limit) * 2);

    res.status(200).json({
      status: 'success',
      query: q,
      count: limitedSuggestions.length,
      data: limitedSuggestions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular search terms
// @route   GET /api/search/popular
// @access  Public
exports.getPopularSearches = async (req, res, next) => {
  try {
    // This would typically come from analytics/search logs
    // For now, return static popular searches
    const popularSearches = [
      { term: 'Goa', type: 'destination', count: 1250 },
      { term: 'Kerala', type: 'destination', count: 1100 },
      { term: 'Rajasthan', type: 'destination', count: 980 },
      { term: 'Himachal Pradesh', type: 'destination', count: 850 },
      { term: 'Luxury Hotels', type: 'hotel', count: 750 },
      { term: 'Beach Resort', type: 'hotel', count: 680 },
      { term: 'Heritage Hotels', type: 'hotel', count: 620 },
      { term: 'Mountain Resort', type: 'hotel', count: 580 }
    ];

    res.status(200).json({
      status: 'success',
      data: popularSearches
    });
  } catch (error) {
    next(error);
  }
};