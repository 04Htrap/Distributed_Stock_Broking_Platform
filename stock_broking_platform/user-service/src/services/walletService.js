const pool = require('../config/db');

async function getWallet(userId) {
  const result = await pool.query(
    `
    SELECT available_balance, locked_balance
    FROM balances
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
}

async function deposit(userId, amount) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }

  const result = await pool.query(
    `
    UPDATE balances
    SET available_balance = available_balance + $1
    WHERE user_id = $2
    RETURNING available_balance, locked_balance
    `,
    [amount, userId]
  );

  if (!result.rows.length) {
    throw new Error('Wallet not found');
  }

  return result.rows[0];
}

module.exports = {
  getWallet,
  deposit
};