const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

        //generate token
        const token = jwt.sign(
            {id: admin._id},
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.json({ 
            token ,
            admin: {
                id: admin._id,
                email: admin.email
            }
         });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    loginAdmin,
}