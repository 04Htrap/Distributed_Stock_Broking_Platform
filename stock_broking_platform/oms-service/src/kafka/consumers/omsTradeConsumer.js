const kafka = require('../kafka');
const pool = require('../../config/db');
const { v4: uuid } = require('uuid');

const consumer = kafka.consumer({
  groupId: 'oms-trade-group'
});

async function startOmsTradeConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'trades',
    fromBeginning: false
  });

  console.log('✅ OMS Trade Consumer Connected');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const trade = JSON.parse(message.value.toString());

        await pool.query(
          `
          INSERT INTO trades
          (id, buy_order_id, sell_order_id, symbol, price, quantity, created_at)
          VALUES($1,$2,$3,$4,$5,$6,NOW())
          `,
          [
            trade.tradeId,
            trade.buyOrderId,
            trade.sellOrderId,
            trade.symbol,
            trade.price,
            trade.quantity
            ]
        );

        console.log('💹 Trade stored');

      } catch (err) {
        console.error('❌ OMS trade error:', err.message);
      }
    }
  });
}

module.exports = { startOmsTradeConsumer };