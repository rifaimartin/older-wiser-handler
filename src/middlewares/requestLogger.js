const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const start = Date.now();

  // Log when response finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id
    });
  });

  next();
};