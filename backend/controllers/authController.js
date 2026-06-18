const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate refresh token
const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

//login admin
const loginAdmin = async (req,res) => {
    try {
        const { email, password } = req.body;

        //check email 
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //check password
        const isMatch = await bcrypt.compare(
            password,
            admin.password
        )
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //generate access token
        const token = jwt.sign(
            {id: admin._id},
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        //generate refresh token
        const refreshToken = generateRefreshToken();
        
        //save refresh token to database
        admin.refreshToken = refreshToken;
        await admin.save();

        res.json({ 
            token,
            refreshToken,
            admin: {
                id: admin._id,
                email: admin.email
            }
         });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//refresh token
const refreshToken = async (req,res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        //find admin with this refresh token
        const admin = await Admin.findOne({ refreshToken });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        //generate new access token
        const token = jwt.sign(
            {id: admin._id},
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        //generate new refresh token
        const newRefreshToken = generateRefreshToken();
        
        //save new refresh token to database
        admin.refreshToken = newRefreshToken;
        await admin.save();

        res.json({ 
            token,
            refreshToken: newRefreshToken
         });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//logout
const logoutAdmin = async (req,res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            //remove refresh token from database
            await Admin.findOneAndUpdate(
                { refreshToken },
                { refreshToken: null }
            );
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    loginAdmin,
    refreshToken,
    logoutAdmin,
}