const User = require('../models/User');
const ResponseFormatter = require('../utils/ResponseFormatter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const config = require('../config/config'); 

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return ResponseFormatter.error(res, 'Email already registered', 400);
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
      });

      await user.save();

      // Remove password from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
      };

      return ResponseFormatter.success(res, 'Registration successful', userResponse, 201);
    } catch (error) {
      return ResponseFormatter.error(res, error.message);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      // Return user data and token
      return res.json({
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          token
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

}

module.exports = AuthController;