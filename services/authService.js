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
  try {
    if (!loginData.email || !loginData.password) {
      throw new Error('Email and password are required');
    }

    const decryptedEmail = decrypt(loginData.email, config.jwt.secretKey);
    const decryptedPassword = decrypt(loginData.password, config.jwt.secretKey);
    
    const user = await User.findOne({ where: { email: decryptedEmail } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(decryptedPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const existingSession = await getDecryptedSessionByUserId(user.id);
    if (existingSession) {
      return { message: 'Session already exists', existingSession };
    }

    const token = JWT.sign({ userId: user.id, email: user.email }, jwtConfig.jwt.secretKey, { expiresIn: jwtConfig.jwt.expiresIn });

    const encryptedSessionId = await createEncryptedSession(user.id, token, user.email);

    return { sessionId: encryptedSessionId };
  } catch (error) {
    throw new Error(error.message);
  }
};


// exports.loginUser = async (loginData) => {
//   // console.log(loginData,'sa')
//   try {

//     const decryptedEmail = decrypt(loginData.email,config.jwt.secretKey ); // Use your actual key
//     const decryptedPassword = decrypt(loginData.password,config.jwt.secretKey ); // Use your actual key
//     console.log(decryptedEmail,decryptedPassword,'sagar')
//     const user = await User.findOne({ where: { email: decryptedEmail } });
//     if (!user) {
//       throw new Error('Invalid email or password');
//     }

//     const isPasswordValid = await bcrypt.compare(decryptedPassword, user.password);
//     console.log(isPasswordValid,'isPasswordValid')
//     if (!isPasswordValid) {
//       throw new Error('Invalid email or password');
//     }
//     // Check if there's an active session
//     const existingSession = await getDecryptedSessionByUserId(user.id);
//     console.log(existingSession,existingSession)
//     console.log(existingSession, 'existingSession');
//     if (existingSession) {
//       console.log('User ID:', user.id); // Log userId if session exists
//       return { message: 'Session already exists',existingSession };
//     }

//     // No active session found, create a new session
//     const token = JWT.sign({ userId: user.id, email: user.email }, jwtConfig.jwt.secretKey, { expiresIn: jwtConfig.jwt.expiresIn });

//     const encryptedSessionId = await createEncryptedSession(user.id, token, user.email);

//     return { sessionId: encryptedSessionId };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

exports.logoutUser = async ( sessionId) => {
  try {
    // Decode the session ID
    // const decodedSessionId = decodeURIComponent(sessionId);
    // // Decrypt the session ID
    // const decryptedSessionId = decrypt(decodedSessionId, jwtConfig.secretKey);
    await deleteSession(sessionId);

    return { message: 'Logout successful' };
  } catch (error) {
    throw new Error(error.message);
  }
};
