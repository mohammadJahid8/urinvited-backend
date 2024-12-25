import nodemailer from 'nodemailer';
import { template } from './emailTemplate.js';
import { reminderTemplate } from './reminderTemplate.js';
import config from '../config/config.js';
import { updateTemplate } from './updateTemplate.js';

export const sendMail = async (
  name,
  emails,
  subject,
  inviteLink,
  message,
  eventName,
) => {
  const mailTemp =
    inviteLink && name
      ? template(inviteLink, name, eventName)
      : inviteLink
      ? updateTemplate(inviteLink, eventName)
      : reminderTemplate(message, name, eventName);

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
    to: emails,
    subject,
    html: mailTemp,
  };

  try {
    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.log('Something went wrong while sending mail', error);
  }
};
