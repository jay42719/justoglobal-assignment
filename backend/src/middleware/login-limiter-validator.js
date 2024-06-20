'use strict';

const rateLimit = require('express-rate-limit');

// Rate limiter middleware
module.exports = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({ message: 'Too many login attempts. Please try again later.' });
    }
});