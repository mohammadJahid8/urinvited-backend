import nodemailer from 'nodemailer';
import config from '../../../config/config.js';

export async function sendEmail(to, html) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.email,
        pass: config.app_pass,
      },
    });

    await transporter.sendMail({
      from: config.email, // sender address
      to, // list of receivers
      subject: 'Reset Password', // Subject line
      html, // html body
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}
