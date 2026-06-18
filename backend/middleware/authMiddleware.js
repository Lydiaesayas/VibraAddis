const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Try to get admin first, then user
            req.admin = await Admin.findById(decoded.id).select('-password -refreshToken');
            
            if (req.admin) {
                req.user = req.admin; // For compatibility
                next();
                return;
            }

            // If not admin, try user
            req.user = await User.findById(decoded.id).select('-password -refreshToken');
            
            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    }

    if (!token) {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};

// Admin-only middleware
const adminOnly = async (req, res, next) => {
    if (req.admin) {
        next();
    } else {
        res.status(403);
        next(new Error('Not authorized as admin'));
    }
};

module.exports = { protect, adminOnly };
