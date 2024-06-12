const { createClient } = require('redis');

const client = createClient({
  password: 'Flm2pRfLH6aiCxNeBSAV3ustjsBjZBBd',
  socket: {
    host: 'redis-17936.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 17936
  }
});

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', (err) => {
  console.error('Redis client error:', err);
});

// Connect to Redis
client.connect();

module.exports = client;
