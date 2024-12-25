import nodemailer from 'nodemailer';

export const resetMail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Reachoutpro.ai@gmail.com',
      pass: 'fhtkcqbdluziedjm',
    },
  });

  const mailOptions = {
    from: 'Reachoutpro.ai@gmail.com',
    to: email,
    subject: `Reset your password`,
    text: `Please reset your password from the link below: https://www.urinvited.io/reset-password/${link}`,
    // text: `Please reset your password from the link below: http://localhost:5173/reset-password/${link}`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.log('Something went wrong while sending mail', error);
  }
};
