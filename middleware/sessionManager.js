// // sessionManager.js

// const redisClient = require('./redis');
// const { encrypt, decrypt } = require('./encrypt');
// const SESSION_EXPIRY_SECONDS = 3600; // 1 hour
// const jwtConfig = require('../config/config');

// const generateSessionId = () => {
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let sessionId = '';
//   for (let i = 0; i < 8; i++) {
//     sessionId += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return sessionId;
// };

// const createSession = async (userId, token, email) => {
//   const sessionId = generateSessionId();

//   // Store session data in the Redis hash with the session ID as the key
//   await redisClient.hSet(sessionId, {
//     email,
//     token,
//     userId: userId.toString() // Ensure it's a string for Redis
//   });

//   // Set expiry time for the session key
//   await redisClient.expire(sessionId, SESSION_EXPIRY_SECONDS);

//   return sessionId;
// };

// const deleteSession = async (sessionId) => {
//   // Delete the session data hash
//   await redisClient.del(sessionId);
// };

// const getSessionByUserId = async (userId) => {
//   const keys = await redisClient.keys('*');
//   for (const key of keys) {
//     const sessionData = await redisClient.hGetAll(key);
//     if (sessionData && sessionData.userId === userId.toString()) {
//       return { key, sessionId: sessionData };
//     }
//   }
//   return null;
// };

// const createEncryptedSession = async (userId, token, email) => {
//   const sessionId = await createSession(userId, token, email);
//   const encryptedSessionId = encrypt(sessionId, jwtConfig.secretKey); // Encrypt session ID
//   return encryptedSessionId;
// };

// const getDecryptedSessionByUserId = async (userId) => {
//   const encryptedSession = await getSessionByUserId(userId);
//   if (encryptedSession) {
//     const decryptedSessionId = decrypt(encryptedSession.sessionId.token, jwtConfig.secretKey); // Decrypt session ID
//     return { decryptedSessionId, sessionData: encryptedSession.sessionId };
//   }
//   return null;
// };

// module.exports = {
//   createSession,
//   deleteSession,
//   getSessionByUserId,
//   createEncryptedSession,
//   getDecryptedSessionByUserId
// };


const redisClient = require('./redis');
const { encrypt, decrypt } = require('./encrypt');
const jwtConfig = require('../config/config');

const SESSION_EXPIRY_SECONDS = 3600; // 1 hour

const generateSessionId = () => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let sessionId = '';
  for (let i = 0; i < 8; i++) {
    sessionId += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return sessionId;
};

const createSession = async (userId, token, email) => {
  const sessionId = generateSessionId();

  await redisClient.hSet(sessionId, {
    email,
    token,
    userId: userId.toString() // Ensure it's a string for Redis
  });

  await redisClient.expire(sessionId, SESSION_EXPIRY_SECONDS);

  return sessionId;
};

const deleteSession = async (sessionId) => {
  await redisClient.del(sessionId);
};

const getSessionByUserId = async (userId) => {
  const keys = await redisClient.keys('*');
  for (const key of keys) {
    const sessionData = await redisClient.hGetAll(key);
    if (sessionData && sessionData.userId === userId.toString()) {
      return { key, sessionId: sessionData };
    }
  }
  return null;
};

const createEncryptedSession = async (userId, token, email) => {
  const sessionId = await createSession(userId, token, email);
  const encryptedSessionId = encrypt(sessionId); // Encrypt session ID
  return encryptedSessionId;
};

const getDecryptedSessionByUserId = async (userId) => {
  const encryptedSession = await getSessionByUserId(userId);
  if (encryptedSession) {
    const decryptedSessionId = decrypt(encryptedSession.sessionId.token); // Decrypt session ID
    return { decryptedSessionId, sessionData: encryptedSession.sessionId };
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
