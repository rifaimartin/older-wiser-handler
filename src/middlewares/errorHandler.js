const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error('Error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    user: req.user?.id
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};