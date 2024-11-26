require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: "mongodb://127.0.0.1:27017/older_wiser",  // Gunakan IP ini
  environment: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "212a32b967f08befd9f0728dc91c2edd2a86b1b21ec3ee8b617628a66f9639dcebd644e3861f67d912b9c7085183c394ee22f294f048939dc2d1d79516ee1941",
  jwtExpire: '24h'
};