const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const User = require('../models/userModel');
const redisClient = require('../middleware/redis');
const crypto = require("crypto")
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

    const token = JWT.sign({ userId: user.id, email: user.email }, jwtConfig.secretKey, { expiresIn: jwtConfig.expiresIn });

    // Ensure the Redis client is connected before setting the token
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const sessionId = crypto.randomBytes(32).toString('hex');
    await redisClient.set(sessionId, JSON.stringify({ token, userId: user.id }));

    return { userId: user.id, token };
  } catch (error) {
    throw new Error(error.message);
  }
};
