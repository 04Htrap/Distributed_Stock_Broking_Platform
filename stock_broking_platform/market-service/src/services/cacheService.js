const redis = require('../redis/redisClient');

async function getCache(key) {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

async function setCache(key, value, ttl = 30) {
  await redis.setEx(
    key,
    ttl,
    JSON.stringify(value)
  );
}

module.exports = {
  getCache,
  setCache
};