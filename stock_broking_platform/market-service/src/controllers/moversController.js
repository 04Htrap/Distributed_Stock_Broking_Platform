const axios = require('axios');
const { getCache, setCache } = require('../services/cacheService');

exports.getMovers = async (req, res) => {
  try {
    const cacheKey = 'market:movers';

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const url =
`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=${process.env.POLYGON_API_KEY}`;

    const response = await axios.get(url);

    const gainers = (response.data.tickers || []).slice(0, 10).map(t => ({
      symbol: t.ticker,
      price: t.day.c,
      change: t.day.c - t.day.o,
      percent: ((t.day.c - t.day.o) / t.day.o) * 100
    }));

    await setCache(cacheKey, gainers, 60);

    res.json(gainers);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};