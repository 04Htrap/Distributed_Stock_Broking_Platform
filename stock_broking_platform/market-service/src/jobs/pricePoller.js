const { redis } = require('../redis/redisClient');
const { fetchQuote } = require('../services/quoteService');

function startPricePoller() {
  setInterval(async () => {
    try {
      const symbols =
        await redis.sMembers('active_symbols');

      for (const symbol of symbols) {
        try {
          await fetchQuote(symbol);
        } catch (err) {}
      }

      if (symbols.length) {
        console.log(
          '🔄 Prices refreshed:',
          symbols.join(',')
        );
      }

    } catch (err) {
      console.error(
        '❌ Poller error:',
        err.message
      );
    }
  }, 5000);
}

module.exports = { startPricePoller };