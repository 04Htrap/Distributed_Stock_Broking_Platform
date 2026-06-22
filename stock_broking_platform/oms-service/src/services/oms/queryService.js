const pool = require('../../config/db');

async function getOrdersByUser(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

async function getOrderById(id) {
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}

module.exports = {
  getOrdersByUser,
  getOrderById
};