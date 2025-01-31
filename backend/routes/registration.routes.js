const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration.controller');

// Route to handle new registrations
router.post('/register', registrationController.register);

// Route to get all registrations (protected route for admin use)
router.get('/all', registrationController.getAllRegistrations);

module.exports = router;