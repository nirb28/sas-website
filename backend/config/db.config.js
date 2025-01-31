const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI; // Get URI from .env
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in .env'); // Handle missing URI
        }

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Important: Exit process on connection failure
    }
};

module.exports = connectDB;