const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'trading-app',
  brokers: ['localhost:9092'],
});

module.exports = kafka;