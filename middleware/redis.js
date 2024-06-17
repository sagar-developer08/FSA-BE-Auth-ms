// const { createClient } = require('redis');
// const config = require('../config/config');

// const client = createClient({
//   password: 'Flm2pRfLH6aiCxNeBSAV3ustjsBjZBBd',
//   socket: {
//     host: config.host,
//     port: config.port
//   }
// });

// client.on('connect', () => {
//   console.log('Redis client connected');
// });

// client.on('error', (err) => {
//   console.error('Redis client error:', err);
// });

// // Connect to Redis
// client.connect();

// module.exports = client;


const { createClient } = require('redis');
const config = require('../config/config');

const client = createClient({
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port
  }
});

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', (err) => {
  console.error('Redis client error:', err);
});

client.connect();

module.exports = client;
