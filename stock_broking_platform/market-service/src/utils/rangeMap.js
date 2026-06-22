function getRangeConfig(range) {
  switch (range) {
    case '1D':
      return { multiplier: 5, timespan: 'minute', fromDays: 1 };

    case '1W':
      return { multiplier: 30, timespan: 'minute', fromDays: 7 };

    case '1M':
      return { multiplier: 1, timespan: 'day', fromDays: 30 };

    case '1Y':
      return { multiplier: 1, timespan: 'week', fromDays: 365 };

    default:
      return { multiplier: 5, timespan: 'minute', fromDays: 1 };
  }
}

module.exports = { getRangeConfig };