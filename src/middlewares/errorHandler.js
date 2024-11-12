const ResponseFormatter = require('../utils/ResponseFormatter');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return ResponseFormatter.error(res, 'Validation Error', 400, err.errors);
  }

  if (err.name === 'CastError') {
    return ResponseFormatter.error(res, 'Invalid ID', 400);
  }

  return ResponseFormatter.error(res, err.message || 'Internal Server Error', err.statusCode || 500);
};

module.exports = errorHandler;