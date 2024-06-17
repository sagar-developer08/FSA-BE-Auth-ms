const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const jwtConfig = require('../config/config');
const User = require('../models/userModel');
const { createEncryptedSession, getDecryptedSessionByUserId, deleteSession } = require('../middleware/sessionManager');
const { decrypt } = require('../middleware/encrypt');
const config = require('../config/config');

exports.registerUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.loginUser = async (loginData) => {
  // console.log(loginData,'sa')
  try {

    const decryptedEmail = decrypt(loginData.email,config.secretKey ); // Use your actual key
    const decryptedPassword = decrypt(loginData.password,config.secretKey ); // Use your actual key

    const user = await User.findOne({ where: { email: decryptedEmail } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(decryptedPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if there's an active session
    const existingSession = await getDecryptedSessionByUserId(user.id);
    console.log(existingSession, 's');
    if (existingSession) {
      console.log('User ID:', user.id); // Log userId if session exists
      return { message: 'Session already exists',existingSession };
    }

    // No active session found, create a new session
    const token = JWT.sign({ userId: user.id, email: user.email }, jwtConfig.secretKey, { expiresIn: jwtConfig.expiresIn });

    const encryptedSessionId = await createEncryptedSession(user.id, token, user.email);

    return { sessionId: encryptedSessionId };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.logoutUser = async (userId, sessionId) => {
  try {
    // Decode the session ID
    const decodedSessionId = decodeURIComponent(sessionId);
    // Decrypt the session ID
    const decryptedSessionId = decrypt(decodedSessionId, jwtConfig.secretKey);
    await deleteSession(decryptedSessionId);

    return { message: 'Logout successful' };
  } catch (error) {
    throw new Error(error.message);
  }
};
