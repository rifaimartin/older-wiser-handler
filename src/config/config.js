require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: "mongodb://127.0.0.1:27017/older_wiser",  // Gunakan IP ini
  environment: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key"
};