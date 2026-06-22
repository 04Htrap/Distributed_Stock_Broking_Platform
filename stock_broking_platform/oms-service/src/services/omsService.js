const Order = require('../models/Order');
const { createOrder } = require('./orderService');
const crypto = require('crypto');
const { sendMessage } = require('../kafka/producer');

async function placeOrder(data) {
  const order = new Order({
    id: crypto.randomUUID(),
    userId: data.userId,
    symbol: data.symbol,
    side: data.side,
    type: data.type,
    price: data.price,
    quantity: data.quantity,
    timestamp: Date.now()
  });

  // 1. validate + lock + store
  await createOrder(order);

  // 2. send to Kafka instead of engine
  await sendMessage("orders", order);

  return {
    orderId: order.id,
    status: "PENDING"
  };
}

module.exports = { placeOrder };