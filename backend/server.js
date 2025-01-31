require('dotenv').config();
console.log("HI I LIKE DOGS WOOF WOOF WOOF WOOF WOOF");
const connectDB = require('./config/db.config');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const registrationRoutes = require('./routes/registration.routes');
console.log('About to require contactRoutes');
const contactRoutes = require('./routes/contactRoutes');
console.log('Successfully required contactRoutes');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/registration', registrationRoutes);
app.use('/api/contact', contactRoutes);

// Connect to database
connectDB();

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});