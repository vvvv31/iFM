const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

module.exports = errorHandler;