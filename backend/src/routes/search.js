const express = require('express');
const { validate, searchSchema } = require('../middlewares/validation');
const {
  search,
  getSearchSuggestions,
  getPopularSearches
} = require('../controllers/searchController');

const router = express.Router();

// Public search routes
router.get('/', validate(searchSchema, 'query'), search);
router.get('/suggestions', getSearchSuggestions);
router.get('/popular', getPopularSearches);

module.exports = router;