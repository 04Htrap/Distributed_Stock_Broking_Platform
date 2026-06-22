const kafka = require('./kafka');
const pool = require('../config/db');

const consumer = kafka.consumer({
  groupId: 'user-trade-group'
});

async function startTradeConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'trades',
    fromBeginning: false
  });

  console.log('✅ User Trade Consumer Connected');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const trade = JSON.parse(message.value.toString());

      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        // BUYER gets shares
        await client.query(
          `
          INSERT INTO portfolio(user_id, symbol, quantity, locked_quantity, avg_price)
          VALUES($1,$2,$3,0,$4)
          ON CONFLICT(user_id, symbol)
          DO UPDATE SET
            avg_price =
              (
                (portfolio.quantity * portfolio.avg_price) +
                ($3 * $4)
              ) / (portfolio.quantity + $3),
            quantity = portfolio.quantity + $3
          `,
          [
            trade.buyUserId,
            trade.symbol,
            trade.quantity,
            trade.price
          ]
        );

        // buyer locked balance reduced
        await client.query(
            `
            UPDATE balances
            SET locked_balance =
                locked_balance - ($1::numeric * $2::numeric)
            WHERE user_id = $3
            `,
            [
                trade.price,
                trade.quantity,
                trade.buyUserId
            ]
        );

        // SELLER gets money
        await client.query(
            `
            UPDATE balances
            SET available_balance =
                available_balance + ($1::numeric * $2::numeric)
            WHERE user_id = $3
            `,
            [
                trade.price,
                trade.quantity,
                trade.sellUserId
            ]
        );

        // seller shares reduced
        await client.query(
          `
          UPDATE portfolio
          SET quantity = quantity - $1,
              locked_quantity = locked_quantity - $1
          WHERE user_id = $2
            AND symbol = $3
          `,
          [
            trade.quantity,
            trade.sellUserId,
            trade.symbol
          ]
        );

        await client.query('COMMIT');

        console.log('💼 Portfolio updated:', trade.symbol);

      } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Trade consumer error:', err.message);
      } finally {
        client.release();
      }
    }
  });
}

module.exports = { startTradeConsumer };