// services/email.service.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const generateEmailContent = (studentName, parentName, startDate, endDate) => {
    const logoUrl = 'https://res.cloudinary.com/dkkd2wj4e/image/upload/v1732570687/cfvvlzq7vsc41skaoku9.png';

    return {
        text: `Dear ${studentName} and ${parentName},

Thank you for joining our machine learning course! We are thrilled to have you on board as part of our learning community.`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="CerebraML Logo" style="max-width: 150px; height: auto;" />
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin-bottom: 15px;">Dear ${studentName} and ${parentName},</h2>
            <p>Thank you for joining us in our new machine learning course! We are thrilled to have you on board as part of our learning community.</p>
        </div>

        <!-- Confirmation Box -->
        <div style="background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin-bottom: 20px;">
            <p style="margin: 0;">We are pleased to confirm that you have successfully registered for the course. This is an exciting opportunity to learn about machine learning and data science!</p>
        </div>

        <!-- Pre-course Preparations -->
        <div style="margin-bottom: 20px;">
            <h3 style="color: #2c3e50;">Pre-course Preparations</h3>
            <p>Please complete the following setup steps before the course begins:</p>
            <ol style="padding-left: 20px;">
                <li style="margin-bottom: 10px;">
                    <strong>Install Python</strong>
                    <br>
                    <a href="https://www.geeksforgeeks.org/how-to-install-python-on-windows/" style="color: #007bff; text-decoration: none;">View Installation Guide →</a>
                </li>
                <li style="margin-bottom: 10px;">
                    <strong>Install Anaconda Navigator</strong>
                    <br>
                    <a href="https://docs.anaconda.com/anaconda/install/" style="color: #007bff; text-decoration: none;">View Step-by-Step Guide →</a>
                </li>
            </ol>
        </div>

        <!-- Course Schedule -->
        <div style="background-color: #e8f4fd; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #2c3e50; margin-top: 0;">Course Schedule</h3>
            <p><strong>Start Date:</strong> ${startDate}</p>
            <p><strong>End Date:</strong> ${endDate}</p>
            <p><strong>Lecture Times:</strong> Every Tuesday and Thursday, 4:00 - 6:00 PM PST</p>
        </div>

        <!-- Student Discord Information -->
        <div style="background-color: #f8f0fc; border-left: 4px solid #862e9c; padding: 15px; margin-bottom: 20px;">
            <h3 style="color: #2c3e50; margin-top: 0;">For Students Only - Important!</h3>
            <p><strong>${studentName}</strong>, please join our Discord server where all meetings and lectures will be held:</p>
            <p style="text-align: center;">
                <a href="https://discord.gg/Xw2HmwbEVt" style="display: inline-block; background-color: #5865F2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 10px 0;">Join Discord Server</a>
            </p>
            <p style="font-size: 14px;">If you don't have a Discord account, you can create one using a personal email by following the instructions here: 
                <a href="https://support.discord.com/hc/en-us/articles/360033931551-Getting-Started" style="color: #007bff; text-decoration: none;">Discord Setup Guide →</a>
            </p>
        </div>

        <!-- Contact Information -->
        <div style="margin-bottom: 20px;">
            <p>If you have any questions before the course begins, feel free to reach out to us at:</p>
            <p style="text-align: center;">
                <a href="mailto:cerebraml@gmail.com" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">cerebraml@gmail.com</a>
            </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666666; font-size: 14px;">Thank you again for joining us on this learning journey.<br>We can't wait to see what you'll accomplish!</p>
            <p style="color: #666666; font-size: 14px; margin-top: 20px;">Best regards,<br>Cerebra ML Team</p>
        </div>
    </div>
</body>
</html>
`
    };
};

const sendRegistrationEmails = async (registrationData) => {
    try {
        const { text, html } = generateEmailContent(
            registrationData.studentName,
            registrationData.parentName,
            registrationData.startDate, // Make sure these are actual dates
            registrationData.endDate
        );

        const emailResult = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: [registrationData.parentEmail, registrationData.studentEmail],
            subject: 'Welcome to Our Machine Learning Course!',
            text: text,
            html: html,
        });

        console.log('Email sent successfully', emailResult);
        return true; // Indicate success

    } catch (error) {
        console.error('Error sending email:', error);

        // Improved error handling: Check for specific properties safely
        if (error.responseCode) {
            console.error('Mail server responded with error code:', error.responseCode);
        }
        if (error.response) {
            console.error('Mail server response:', error.response); // Full response details
        }
        if (error.code === 'EENVELOPE') {
            console.error('Invalid email address:', error.address); // Check for invalid addresses
        }
        if (error.code === 'ETIMEDOUT') {
            console.error('Connection to mail server timed out.');
        }
        // General error logging
        console.error('Full Error Object:', error);

        return false; // Indicate failure
    }
};

module.exports = { sendRegistrationEmails };