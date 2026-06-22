const pool = require('../config/db');

async function getAll(userId) {
  const result = await pool.query(
    `
    SELECT symbol
    FROM watchlist
    WHERE user_id = $1
    ORDER BY symbol
    `,
    [userId]
  );

  return result.rows;
}

async function add(userId, symbol) {
  await pool.query(
    `
    INSERT INTO watchlist(user_id, symbol)
    VALUES($1,$2)
    ON CONFLICT DO NOTHING
    `,
    [userId, symbol.toUpperCase()]
  );

  return getAll(userId);
}

async function remove(userId, symbol) {
  await pool.query(
    `
    DELETE FROM watchlist
    WHERE user_id = $1 AND symbol = $2
    `,
    [userId, symbol.toUpperCase()]
  );

  return getAll(userId);
}

module.exports = {
  getAll,
  add,
  remove
};