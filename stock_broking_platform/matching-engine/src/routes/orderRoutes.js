const router = require('express').Router();

const {
  placeOrder,
  getMyOrders,
  getOrderById
} = require('../../../oms-service/src/controllers/orderController');

router.post('/orders', placeOrder);
router.get('/orders/me', getMyOrders);
router.get('/orders/:id', getOrderById);

module.exports = router;