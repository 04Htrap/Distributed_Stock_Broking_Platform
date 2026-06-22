const router =
require('express').Router();

const {
  getQuote,
  getWatchlist
} = require('../controllers/quoteController');

const {
  getChart
} = require('../controllers/chartController');

const {
  searchSymbol
} = require('../controllers/searchController');

router.get('/quote/:symbol', getQuote);

router.get('/watchlist', getWatchlist);

router.get('/chart/:symbol', getChart);

router.get('/search', searchSymbol);

module.exports = router;