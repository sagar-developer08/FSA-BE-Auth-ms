const crypto = require('crypto');
const redisClient = require('./redis');
const { encrypt, decrypt } = require('./encrypt');
// const { encrypt, decrypt } = require('');
const SESSION_EXPIRY_SECONDS = 3600; // 1 hour
const jwtConfig = require('../config/config');

const createSession = async (userId, token, email) => {
  const sessionId = crypto.randomBytes(32).toString('hex');

  // Store session data in the Redis hash with the session ID as the key
  await redisClient.hSet(sessionId, {
    email,
    token,
    userId: userId.toString() // Ensure it's a string for Redis
  });

  // Set expiry time for the session key
  await redisClient.expire(sessionId, SESSION_EXPIRY_SECONDS);

  // Store a mapping from userId to sessionId
  // await redisClient.set(`user:${userId}:session`, sessionId, { EX: SESSION_EXPIRY_SECONDS });

  return sessionId;
};

const deleteSession = async (sessionId, userId) => {
  // Delete the session data hash
  await redisClient.del(sessionId);
  
  // Delete the mapping between userId and sessionId
  await redisClient.del(`user:${userId}:session`);
};

const getSessionByUserId = async (userId) => {
  const sessionId = await redisClient.get(`user:${userId}:session`);
  if (sessionId) {
    const sessionData = await redisClient.hGetAll(sessionId);
    if (sessionData && Object.keys(sessionData).length > 0) {
      return { sessionId, sessionData };
    }
  }
  return null;
};


const createEncryptedSession = async (userId, token, email) => {
  const sessionId = await createSession(userId, token, email);
  const encryptedSessionId = encrypt(sessionId, jwtConfig.secretKey); // Encrypt session ID
  return encryptedSessionId;
};

const getDecryptedSessionByUserId = async (userId) => {
  const encryptedSession = await getSessionByUserId(userId);
  if (encryptedSession) {
    const decryptedSessionId = decrypt(encryptedSession.sessionId, jwtConfig.secretKey); // Decrypt session ID
    return { decryptedSessionId, sessionData: encryptedSession.sessionData };
  }
  return null;
};

module.exports = {
  createSession,
  deleteSession,
  getSessionByUserId,
  createEncryptedSession,
  getDecryptedSessionByUserId
};
