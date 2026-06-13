const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    const transportOptions = {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
    secure: process.env.EMAIL_SECURE === 'true' || process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  };

    const transporter = nodemailer.createTransport(transportOptions);
  await transporter.verify();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Tife Eat and more 🍔" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
  console.log(`OTP email sent to ${to}`);
};

module.exports = sendEmail;