const kafka = require('./kafka');
const { redis } = require('../redis/redisClient');

const consumer = kafka.consumer({
  groupId: 'market-symbol-group'
});

async function startSymbolConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'market_symbols',
    fromBeginning: false
  });

  console.log('✅ Symbol Consumer Connected');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(
          message.value.toString()
        );

        const symbols = data.symbols || [];

        for (const symbol of symbols) {
          await redis.sAdd(
            'active_symbols',
            symbol.toUpperCase()
          );
        }

        console.log(
          '📈 Active symbols updated:',
          symbols.join(',')
        );

      } catch (err) {
        console.error(
          '❌ Symbol consumer error:',
          err.message
        );
      }
    }
  });
}

module.exports = { startSymbolConsumer };