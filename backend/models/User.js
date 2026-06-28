const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            validate: {
                validator: function(password) {
                    // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    return passwordRegex.test(password);
                },
                message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
            }
        },
        favorites: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Venue'
        }],
        role: {
            type: String,
            enum: ['user', 'owner', 'admin'],
            default: 'user'
        },
        refreshToken: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationToken: {
            type: String,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
