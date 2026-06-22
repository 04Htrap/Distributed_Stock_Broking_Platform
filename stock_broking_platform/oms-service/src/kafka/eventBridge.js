const EventBus = require('../utils/EventBus');
const { sendMessage } = require('./producer');

function startEventBridge() {
  // Order updates
  EventBus.on('ORDER_UPDATED', async (order) => {
    try {
      await sendMessage('order_updates', {
        id: order.id,
        remaining: order.remaining,
        status: order.status
      });

      console.log('📤 ORDER_UPDATED sent to Kafka');
    } catch (err) {
      console.error('❌ ORDER_UPDATED bridge error:', err.message);
    }
  });

  // Trades
EventBus.on('TRADE_EXECUTED', async (trade) => {
  try {
    await sendMessage('trades', {
      tradeId: trade.tradeId,
      buyOrderId: trade.buyOrderId,
      sellOrderId: trade.sellOrderId,
      buyUserId: trade.buyUserId,
      sellUserId: trade.sellUserId,
      symbol: trade.symbol,
      price: trade.price,
      quantity: trade.quantity,
      executedAt: trade.executedAt
    });

    console.log('📤 TRADE_EXECUTED sent to Kafka');

  } catch (err) {
    console.error('❌ TRADE bridge error:', err.message);
  }
});

  console.log('✅ Event Bridge Started');
}

module.exports = { startEventBridge };