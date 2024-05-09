// authService.js
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const User = require('../models/userModel');

exports.registerUser = async (userData) => {
  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // Create the user in the database
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.loginUser = async (loginData) => {
  try {
    // Check if user with the given email exists
    const user = await User.findOne({ where: { email: loginData.email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    // Generate JWT token
    const token = JWT.sign({ userId: user.id, email: user.email }, jwtConfig.secretKey, { expiresIn: jwtConfig.expiresIn });

    return { userId: user.id, token };
  } catch (error) {
    throw new Error(error.message);
  }
};


