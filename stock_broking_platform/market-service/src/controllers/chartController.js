const axios = require('axios');
const { getRangeConfig } = require('../utils/rangeMap');
const { getCache, setCache } = require('../services/cacheService');

exports.getChart = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const range = req.query.range || '1D';

    const cacheKey = `chart:${symbol}:${range}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const cfg = getRangeConfig(range);

    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - cfg.fromDays);

    const url =
`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${cfg.multiplier}/${cfg.timespan}/${from.toISOString().split('T')[0]}/${to.toISOString().split('T')[0]}?adjusted=true&sort=asc&limit=500&apiKey=${process.env.POLYGON_API_KEY}`;

    const response = await axios.get(url);

    const result = response.data.results || [];

    const chart = result.map(c => ({
      time: c.t,
      open: c.o,
      high: c.h,
      low: c.l,
      close: c.c,
      volume: c.v
    }));

    await setCache(cacheKey, chart, 60);

    res.json(chart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};