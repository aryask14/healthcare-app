const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create transporter (use your email service)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // 2. Email options
  const mailOptions = {
    from: `HealthCare+ <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.message
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;