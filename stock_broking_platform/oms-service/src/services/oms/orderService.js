const { v4: uuid } = require('uuid');
const pool = require('../../../../matching-engine/src/config/db');
const { sendMessage } = require('../../kafka/producer');

async function placeOrder(data) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderId = uuid();

    const order = {
      id: orderId,
      userId: data.userId,
      symbol: data.symbol,
      side: data.side,
      type: data.type,
      price: data.price ? Number(data.price) : null,
      quantity: Number(data.quantity),
      remaining: Number(data.quantity),
      status: 'PENDING',
      timestamp: Date.now()
    };

    // =========================
    // 🟢 BUY ORDER
    // =========================
    if (order.side === 'BUY') {
      const amount = order.price * order.quantity;

      const balanceRes = await client.query(
        `
        SELECT available_balance
        FROM balances
        WHERE user_id = $1
        FOR UPDATE
        `,
        [order.userId]
      );

      if (!balanceRes.rows.length) {
        throw new Error('User balance not found');
      }

      const available = Number(balanceRes.rows[0].available_balance);

      if (available < amount) {
        throw new Error('Insufficient balance');
      }

      await client.query(
        `
        UPDATE balances
        SET available_balance = available_balance - $1,
            locked_balance = locked_balance + $1
        WHERE user_id = $2
        `,
        [amount, order.userId]
      );

      console.log('🔒 Balance locked');
    }

    // =========================
    // 🔴 SELL ORDER
    // =========================
    if (order.side === 'SELL') {
      const holdingRes = await client.query(
        `
        SELECT quantity, locked_quantity
        FROM portfolio
        WHERE user_id = $1 AND symbol = $2
        FOR UPDATE
        `,
        [order.userId, order.symbol]
      );

      if (!holdingRes.rows.length) {
        throw new Error('No shares owned');
      }

      const row = holdingRes.rows[0];

      const quantity = Number(row.quantity);
      const locked = Number(row.locked_quantity);
      const availableShares = quantity - locked;

      if (availableShares < order.quantity) {
        throw new Error('Insufficient shares');
      }

      await client.query(
        `
        UPDATE portfolio
        SET locked_quantity = locked_quantity + $1
        WHERE user_id = $2 AND symbol = $3
        `,
        [order.quantity, order.userId, order.symbol]
      );

      console.log('🔒 Shares locked');
    }

    // =========================
    // INSERT ORDER
    // =========================
    await client.query(
      `
      INSERT INTO orders
      (id, user_id, symbol, side, type, price, quantity, remaining, status, created_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
      `,
      [
        order.id,
        order.userId,
        order.symbol,
        order.side,
        order.type,
        order.price,
        order.quantity,
        order.remaining,
        order.status
      ]
    );

    console.log('✅ Order inserted into DB');

    await client.query('COMMIT');

    // =========================
    // SEND TO KAFKA
    // =========================
    await sendMessage('orders', order);

    return {
      orderId: order.id,
      status: 'PENDING'
    };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { placeOrder };