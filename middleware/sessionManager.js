const crypto = require('crypto');
const redisClient = require('./redis');

const SESSION_EXPIRY_SECONDS = 3600; // 1 hour
const SESSIONS_HASH_KEY = 'user_sessions';

const createSession = async (userId, token, email) => {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const sessionData = {
    token,
    userId: userId.toString(), // Ensure it's a string for Redis
    email
  };

  // Store session data in the Redis hash
  await redisClient.hSet(SESSIONS_HASH_KEY, sessionId, JSON.stringify(sessionData),SESSION_EXPIRY_SECONDS);

  // Set expiry time for the session key
  await redisClient.expire(sessionId, SESSION_EXPIRY_SECONDS);

  // Store a mapping from userId to sessionId
  await redisClient.set(`user:${userId}:session`, sessionId, { EX: SESSION_EXPIRY_SECONDS });

  return sessionId;
};

const getSessionByUserId = async (userId) => {
  const sessionId = await redisClient.get(`user:${userId}:session`);
  if (sessionId) {
    const sessionData = await redisClient.hGet(SESSIONS_HASH_KEY, sessionId);
    if (sessionData) {
      return { sessionId, sessionData: JSON.parse(sessionData) };
    }
  }
  return null;
};

module.exports = {
  createSession,
  getSessionByUserId
};
