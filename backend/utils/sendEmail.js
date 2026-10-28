const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const message = {
      from: `${process.env.FROM_NAME || 'Database Shield'} <${process.env.FROM_EMAIL || 'noreply@databaseshield.com'}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(message);
    // Removed console.log for production
  } catch (error) {
    console.error('Email could not be sent:', error.message);
  }
};

module.exports = sendEmail;
