const axios = require('axios');
const { getCache, setCache } = require('../services/cacheService');

exports.searchSymbol = async (req, res) => {
  try {
    const q = (req.query.q || '').toUpperCase();

    if (!q) {
      return res.json([]);
    }

    const cacheKey = `search:${q}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const url =
`https://api.polygon.io/v3/reference/tickers?search=${q}&active=true&limit=10&apiKey=${process.env.POLYGON_API_KEY}`;

    const response = await axios.get(url);

    const results = (response.data.results || []).map(t => ({
      symbol: t.ticker,
      name: t.name,
      market: t.market
    }));

    await setCache(cacheKey, results, 300);

    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};