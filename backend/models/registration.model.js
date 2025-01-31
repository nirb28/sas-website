// models/registration.model.js
const mongoose = require('mongoose');

// Create the blueprint for your registration data
const registrationSchema = new mongoose.Schema({
  // Parent information
  parentName: {
    type: String,
    required: [true, 'Parent name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  
  parentEmail: {
    type: String,
    required: [true, 'Parent email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid parent email']
  },

  // Student information
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },

  studentEmail: {
    type: String,
    required: [true, 'Student email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid student email']
  },

  studentGrade: {
    type: Number,
    required: [true, 'Student grade is required'],
    min: [1, 'Grade must be at least 1'],
    max: [12, 'Grade must not exceed 12']
  },

  interest: {
    type: String,
    trim: true,
    maxlength: 500  // Allow a decent amount of text for their interest explanation
  },

  // Automatically track when the registration was created
  registeredAt: {
    type: Date,
    default: Date.now
  },

  // Track if confirmation emails have been sent
  emailSent: {
    type: Boolean,
    default: false  // Will be set to true after sending confirmation emails
  }
});

// Add an index for faster email searches
registrationSchema.index({ parentEmail: 1, studentEmail: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;