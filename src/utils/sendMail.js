import nodemailer from 'nodemailer';
import config from '../config/config.js';

export const sendMail = async (
  to,
  subject,
  html,
) => {


  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: 'invite@mailurinvited.io',
      pass: config.mail_pass,
    },
  });

  const mailOptions = {
    from: 'invite@mailurinvited.io',
    to: to,
    subject,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.log('Something went wrong while sending mail', error);
  }
};
