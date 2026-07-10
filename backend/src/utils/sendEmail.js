const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn('Email credentials not configured. OTP will only be returned in local/dev responses.');
    return { success: false, skipped: true };
  }

  const transportOptions = {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
    secure: process.env.EMAIL_SECURE === 'true' || process.env.EMAIL_PORT === '465',
    auth: {
      user: emailUser,
      pass: emailPass
    },
    tls: {
      rejectUnauthorized: false
    }
  };

  try {
    const transporter = nodemailer.createTransport(transportOptions);
    await transporter.verify();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Tife Eat and more 🍔" <${emailUser}>`,
      to,
      subject,
      html
    });
    console.log(`OTP email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('OTP email delivery failed:', error.message);
    return { success: false, skipped: false };
  }
};

module.exports = sendEmail;