const nodemailer = require('nodemailer');

const sendProjectNotification = async (clientEmail, architectName, projectTitle) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"WellDrafted Notification" <${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject: `Update on your project: ${projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333;">Project Status Update</h2>
          <p>Hello,</p>
          <p>Your project request for <strong>${projectTitle}</strong> has been reviewed by <strong>${architectName}</strong>.</p>
          <p>They have sent a response to your email. Please check your inbox for further details.</p>
          <p>Best regards,<br>WellDrafted Team.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #888;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = sendProjectNotification;
