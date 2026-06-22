const kafka = require('../kafka');
const pool = require('../../config/db');

const consumer = kafka.consumer({
  groupId: 'oms-order-update-group'
});

async function startOmsOrderUpdateConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'order_updates',
    fromBeginning: false
  });

  console.log('✅ OMS Order Update Consumer Connected');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        await pool.query(
          `
          UPDATE orders
          SET remaining = $1,
              status = $2
          WHERE id = $3
          `,
          [
            data.remaining,
            data.status,
            data.id
          ]
        );

        console.log('📝 Order updated:', data.id, data.status);

      } catch (err) {
        console.error('❌ OMS order update error:', err.message);
      }
    }
  });
}

module.exports = { startOmsOrderUpdateConsumer };