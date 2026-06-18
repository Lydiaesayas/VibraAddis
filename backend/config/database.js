const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibraaddis';
        
        const options = {
            // Server Selection Timeout (in milliseconds)
            serverSelectionTimeoutMS: 5000,
            // Socket Timeout (in milliseconds)
            socketTimeoutMS: 45000,
            // Connection Pool Settings
            maxPoolSize: 50,
            minPoolSize: 5,
            // Retry Settings
            retryWrites: true,
            retryReads: true,
            // SSL Settings for Production
            ssl: process.env.NODE_ENV === 'production',
            // Other Settings
            connectTimeoutMS: 10000,
        };

        await mongoose.connect(mongoURI, options);
        
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
