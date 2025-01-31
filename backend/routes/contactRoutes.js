console.log('Starting to load contactRoutes.js');
const express = require('express');
const ContactMessage = require('../models/contactMessage'); // Add this line for testing
console.log('ContactMessage model loaded:', ContactMessage);
const router = express.Router();
const {
    createMessage,
    getAllMessages,
    deleteMessage
} = require('../controllers/contactController');

console.log('Controller methods loaded:', { createMessage, getAllMessages, deleteMessage });

// Route to submit a new contact message
router.post('/submit', createMessage);

// Route to get all messages
router.get('/messages', getAllMessages);

// Route to delete a message by ID
router.delete('/:id', deleteMessage);

module.exports = router;