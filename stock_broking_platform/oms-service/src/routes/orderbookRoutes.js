const router = require('express').Router();

const {
  getOrderBook
} = require('../controllers/orderbookController');

router.get('/:symbol', getOrderBook);

module.exports = router;