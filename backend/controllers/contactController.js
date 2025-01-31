console.log('Loading contactController.js');
const ContactMessage = require('../models/contactMessage');
console.log('ContactMessage model in controller:', ContactMessage);

// Create a new contact message
const createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        const newMessage = new ContactMessage({
            name,
            email,
            subject,
            message
        });

        await newMessage.save();

        res.status(201).json({ 
            success: true, 
            message: 'Message sent successfully' 
        });
    } catch (error) {
        console.error('Error in createMessage:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error sending message' 
        });
    }
};

// Get all messages (for admin viewing)
const getAllMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ dateSubmitted: -1 });
        res.status(200).json({ 
            success: true, 
            messages 
        });
    } catch (error) {
        console.error('Error in getAllMessages:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error retrieving messages' 
        });
    }
};

const deleteMessage = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedMessage = await ContactMessage.findByIdAndDelete(id);
  
      if (!deletedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      res.status(200).json({ message: 'Message deleted successfully', deletedMessage });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createMessage,
    getAllMessages,
    deleteMessage
};