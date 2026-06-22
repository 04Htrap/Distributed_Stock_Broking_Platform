const router = require('express').Router();

const {
  placeOrder,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');

router.post('/', placeOrder);
router.get('/me', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;