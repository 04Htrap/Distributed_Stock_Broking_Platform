const kafka = require('./kafka');

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("✅ Producer connected");
}

async function sendMessage(topic, message) {
  console.log(`📤 Sending to Kafka topic: ${topic}`);

  await producer.send({
    topic,
    messages: [
      { value: JSON.stringify(message) }
    ],
  });
}

module.exports = { connectProducer, sendMessage };