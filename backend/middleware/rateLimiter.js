const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
      success: false,
      error: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
      success: false,
      error: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

module.exports = { authLimiter, apiLimiter };
