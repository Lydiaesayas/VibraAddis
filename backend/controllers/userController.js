const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate refresh token
const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        // Generate tokens
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            token,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                favorites: user.favorites
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            token,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                favorites: user.favorites
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Refresh token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        // Find user with this refresh token
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new access token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Generate new refresh token
        const newRefreshToken = generateRefreshToken();
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            token,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            favorites: user.favorites
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add favorite venue
const addFavorite = async (req, res) => {
    try {
        const { venueId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.favorites.includes(venueId)) {
            user.favorites.push(venueId);
            await user.save();
        }

        res.json({ favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove favorite venue
const removeFavorite = async (req, res) => {
    try {
        const { venueId } = req.params;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.favorites = user.favorites.filter(fav => fav.toString() !== venueId);
        await user.save();

        res.json({ favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout user
const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            await User.findOneAndUpdate(
                { refreshToken },
                { refreshToken: null }
            );
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    refreshToken,
    getUserProfile,
    updateUserProfile,
    addFavorite,
    removeFavorite,
    logoutUser,
    getAllUsers
};
