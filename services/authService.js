const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const jwtConfig = require('../config/config');
const User = require('../models/userModel');
const { createSession, getSessionByUserId,createEncryptedSession, getDecryptedSessionByUserId } = require('../middleware/sessionManager');

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
  try {
    const user = await User.findOne({ where: { email: loginData.email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if there's an active session
    const existingSession = await getDecryptedSessionByUserId(user.id);
    if (existingSession) {
      return { message: 'Session already exists', userId: user.id, sessionId: existingSession.decryptedSessionId };
    }

    // No active session found, create a new session
    const token = JWT.sign({ userId: user.id, email: user.email }, jwtConfig.secretKey, { expiresIn: jwtConfig.expiresIn });

    // const sessionId = await createSession(user.id, token, user.email);
    const encryptedSessionId = await createEncryptedSession(user.id, token, user.email);

    return {  sessionId:encryptedSessionId };
  } catch (error) {
    throw new Error(error.message);
  }
};
