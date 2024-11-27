const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpire } = require('../config/config');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate token
      const token = jwt.sign(
        { id: user._id },
        jwtSecret,
        { expiresIn: jwtExpire }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            membershipLevel: user.membershipLevel,
            imageUrl: user.imageUrl,
            settings: user.settings
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async upgradeMembership(req, res) {
    try {
      const { id } = req.user;
      const { membershipLevel, membershipExpiry } = req.body;
  
      const user = await User.findByIdAndUpdate(
        id,
        {
          membershipLevel,
          membershipExpiry,
          updatedAt: Date.now()
        },
        { new: true }
      ).select('-password');
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.json({
        success: true,
        data: user
      });
  
    } catch (error) {
      console.error('Upgrade membership error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upgrade membership'
      });
    }
  }

  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }

      // Create new user
      const user = await User.create({
        name,
        email,
        role: "user",
        password
      });

      // Generate token
      const token = jwt.sign(
        { id: user._id },
        jwtSecret,
        { expiresIn: jwtExpire }
      );

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });

    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const user = await User.findOne({ email })
        .select('-password')
        .lean();
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userProfile = {
        personalInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          imageUrl: user.imageUrl,
          role: user.role
        },
        settings: user.settings,
        timestamps: {
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      };

      res.json({
        success: true,
        data: userProfile
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false, 
        message: 'Internal server error'
      });
    }
  }
  static async getMyProfile(req, res) {
    try {
      const { id } = req.user;
      
      const user = await User.findById(id)
        .select('-password')
        .lean();
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userProfile = {
        personalInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          imageUrl: user.imageUrl,
          role: user.role
        },
        settings: user.settings,
        timestamps: {
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      };

      res.json({
        success: true,
        data: userProfile
      });

    } catch (error) {
      console.error('Get my profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name, email, phone } = req.body;
      
      // Cari user berdasarkan email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Handle image upload jika ada file
      let imageUrl;
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      // Prepare update data
      const updateData = {
        name,
        phone,
        ...(imageUrl && { imageUrl }),
        updatedAt: Date.now()
      };

      // Update user dan return updated document
      const updatedUser = await User.findOneAndUpdate(
        { email }, // Query by email
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      res.json({
        success: true,
        data: updatedUser
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async updateSettings(req, res) {
    try {
      const { id } = req.user;
      const { theme, language, region } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        {
          'settings.theme': theme,
          'settings.language': language,
          'settings.region': region,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Bisa ditambahkan method lain seperti:
  // - changePassword
  // - forgotPassword
  // - resetPassword
  // - verifyEmail
  // dll
}

module.exports = AuthController;