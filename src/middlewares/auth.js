const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/config');

const auth = async (req, res, next) => {
 try {
   // Get token from header
   const token = req.header('Authorization')?.replace('Bearer ', '');

   if (!token) {
     return res.status(401).json({ 
       success: false,
       message: 'No token, authorization denied' 
     });
   }

   // Verify token
   const decoded = jwt.verify(token, jwtSecret);

   // Check if user still exists
   const user = await User.findOne({ 
     _id: decoded.id,
     // Optionally check if token is in user's tokens list if you implement token tracking
   });

   if (!user) {
     return res.status(401).json({
       success: false,
       message: 'User not found'
     });
   }

   // Add user to request
   req.user = {
     id: user._id,
     name: user.name,
     email: user.email,
     role: user.role
   };

   next();
 } catch (error) {
   if (error.name === 'JsonWebTokenError') {
     return res.status(401).json({
       success: false,
       message: 'Invalid token'
     });
   }

   if (error.name === 'TokenExpiredError') {
     return res.status(401).json({
       success: false,
       message: 'Token expired'
     });
   }

   console.error('Auth middleware error:', error);
   res.status(500).json({
     success: false,
     message: 'Server Error'
   });
 }
};

// Optional: Admin only middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Authorization denied' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin only.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};

// Optional: Role-based middleware
const checkRole = (roles) => {
 return (req, res, next) => {
   if (!roles.includes(req.user.role)) {
     return res.status(403).json({
       success: false,
       message: 'Access denied. Insufficient privileges.'
     });
   }
   next();
 };
};

module.exports = {
 auth,
 adminAuth,
 checkRole
};