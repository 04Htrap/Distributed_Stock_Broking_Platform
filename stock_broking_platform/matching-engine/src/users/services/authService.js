const pool = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = 'SUPER_SECRET_KEY';

async function register(data) {
  const { name, email, password } = data;

  const existing = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email]
  );

  if (existing.rows.length) {
    throw new Error('Email already registered');
  }

  const userId = crypto.randomUUID();

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `
    INSERT INTO users(id, name, email, password_hash)
    VALUES($1,$2,$3,$4)
    `,
    [userId, name, email, hash]
  );

  await pool.query(
    `
    INSERT INTO balances(user_id, available_balance, locked_balance)
    VALUES($1,0,0)
    `,
    [userId]
  );

  return {
    message: 'Registered successfully',
    userId
  };
}

async function login(data) {
  const { email, password } = data;

  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (!result.rows.length) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];

  const ok = await bcrypt.compare(password, user.password_hash);

  if (!ok) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token };
}

async function getMe(userId) {
  const result = await pool.query(
    `
    SELECT id, name, email, created_at
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  return result.rows[0];
}

module.exports = {
  register,
  login,
  getMe,
  JWT_SECRET
};