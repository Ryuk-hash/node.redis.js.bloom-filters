const redis = require('redis');

const clientObj = { socket: { host: 'localhost', port: 6379 } };
const redisClient = redis.createClient(clientObj);

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis Connected');
  } catch (err) {
    console.error('Redis Connection Failed:', err);
  }
})();

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

module.exports = redisClient;
