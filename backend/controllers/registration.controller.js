const Registration = require('../models/registration.model');
const { sendRegistrationEmails } = require('../services/email.service');  // Make sure this line exists


const registrationController = {
    register: async (req, res) => {
        try {
            // Create new registration
            const newRegistration = new Registration({
                parentName: req.body.parentName,
                parentEmail: req.body.parentEmail,
                studentName: req.body.studentName,
                studentEmail: req.body.studentEmail,
                studentGrade: req.body.studentGrade,
                interest: req.body.interest
            });

            // Save to database
            const savedRegistration = await newRegistration.save();

            // Try to send emails
            try {
                const emailSent = await sendRegistrationEmails(savedRegistration);
                savedRegistration.emailSent = emailSent; // Set based on actual sending success
                await savedRegistration.save();
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                // Update savedRegistration.emailSent to false here (optional)
                // savedRegistration.emailSent = false; // Uncomment to set emailSent to false
                // await savedRegistration.save(); // Uncomment to save the update
            }

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: savedRegistration
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(400).json({
                success: false,
                message: 'Registration failed: ' + error.message,
                error: error.message
            });
        }
    },

    // Get all registrations (maybe useful for admin purposes)
    getAllRegistrations: async (req, res) => {
        try {
            const registrations = await Registration.find();
            res.status(200).json({
                success: true,
                data: registrations
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
};

module.exports = registrationController;