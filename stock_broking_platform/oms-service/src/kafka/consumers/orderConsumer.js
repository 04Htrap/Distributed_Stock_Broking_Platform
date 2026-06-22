const kafka = require('../kafka');
const engine = require('../../../../oms-service/src/engine/engineSingleton');
const Order = require('../../models/Order');

const consumer = kafka.consumer({ groupId: 'engine-group-v1' });

async function startOrderConsumer() {
  await consumer.connect();
  console.log("✅ Order Consumer Connected");

  await consumer.subscribe({ topic: 'orders', fromBeginning: true });
  console.log("📡 Subscribed to 'orders' topic");

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log("📥 Order received from Kafka");

      const orderData = JSON.parse(message.value.toString());
      const order = new Order(orderData);

      console.log("➡️ Sending to engine:", order.side, order.symbol);

      engine.processOrder(order);
    },
  });
}

module.exports = { startOrderConsumer };