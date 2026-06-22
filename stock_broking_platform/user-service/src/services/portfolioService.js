const pool = require('../config/db');

async function getPortfolio(userId) {
  const result = await pool.query(
    `
    SELECT symbol, quantity, locked_quantity, avg_price
    FROM portfolio
    WHERE user_id = $1
    ORDER BY symbol
    `,
    [userId]
  );

  return result.rows;
}

async function getHolding(userId, symbol) {
  const result = await pool.query(
    `
    SELECT symbol, quantity, locked_quantity, avg_price
    FROM portfolio
    WHERE user_id = $1 AND symbol = $2
    `,
    [userId, symbol]
  );

  return result.rows[0];
}

module.exports = {
  getPortfolio,
  getHolding
};