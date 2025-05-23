import config from '../../../config/config.js';
import { template } from '../../../utils/emailTemplate.js';
import { sendMail } from '../../../utils/sendMail.js';
import twilio from 'twilio';
import { Share } from './share.model.js';
import { Rsvp } from '../rsvp/rsvp.model.js';

const client = twilio(config.twilio_sid, config.twilio_auth_token);

const sendMailToUser = async data => {
  const { subject, body, to } = data;
  const emailTemplate = template(subject, body);

  const result = await sendMail(to, subject, emailTemplate);
  return result;
};
// const shareEvent = async (data) => {

//   const { eventLink, guests, hostName, eventId } = data;

//   if (!eventId || !Array.isArray(guests)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payload');
//   }

//   // Find the document with the specified event ID
//   let shareDoc = await Share.findOne({ event: eventId });

//   if (!shareDoc) {
//     // If no document exists, create a new one
//     shareDoc = new Share({ event: eventId, guests });
//   } else {

//     const existingGuests = shareDoc.guests;

//     guests.forEach((guest) => {
//       // Check if the guest already exists in existingGuests
//       const existingIndex = existingGuests.findIndex(
//         (existingGuest) =>
//           existingGuest.email === guest.email && existingGuest.phone === guest.phone
//       );

//       if (existingIndex !== -1) {
//         // Update the existing guest
//         existingGuests[existingIndex] = {
//           ...existingGuests[existingIndex],
//           ...guest,
//         };
//       } else {
//         // Add the new guest
//         existingGuests.push(guest);
//       }
//     });

//     shareDoc.guests = existingGuests;

//   }

//   await shareDoc.save();
//   const guestWithEmail = guests
//     ?.filter((guest) => guest?.email)
//     .filter(Boolean);
//   const guestWithPhone = guests
//     ?.filter((guest) => guest?.phone)
//     .filter(Boolean);

//   for (const guest of guestWithPhone) {
//     await client.messages.create({
//       // to: "+8801633909408",
//       to: guest?.phone,
//       from: '+16197752197',
//       body: `Hi ${guest?.name}, You are invited to ${hostName}'s event. Please click on the link to join the event: ${eventLink}?e=${guest?.email || guest?.phone}&n=${guest?.name}`,
//       // mediaUrl: [
//       //   "https://res.cloudinary.com/ddvrxtfbc/image/upload/v1738227298/z81qfpyoeklumutk1xvc.jpg"
//       // ]
//       shortenUrls: true,

//     });
//   }

//   for (const guest of guestWithEmail) {
//     await sendMail(guest?.email, `Invitation to ${hostName}'s event`, template(`Invitation to ${hostName}'s event`, `<p>Hi ${guest?.name}, You are invited to ${hostName}'s event. Please click on the link to join the event: <a href="${eventLink}?e=${guest?.email || guest?.phone}&n=${guest?.name}">Click here</a></p>`));
//   }
//   return {
//     message: "Event shared successfully",
//   };
// };

const shareEvent = async data => {
  const { eventLink, guests, hostName, eventId } = data;

  const guestWithEmails = guests.filter(guest => guest.contact.includes('@'));
  const guestWithPhones = guests.filter(guest => guest.contact.includes('+'));

  for (const guest of guestWithPhones) {
    await client.messages.create({
      // to: "+8801633909408",
      to: guest?.contact,
      from: config.twilio_phone_number,

      body: `Hi ${
        guest?.name
      }, You are invited to ${hostName}'s event. Please click on the link to join the event: ${eventLink}?e=${
        guest?.email || guest?.phone
      }&n=${guest?.name}`,
      // mediaUrl: [
      //   "https://res.cloudinary.com/ddvrxtfbc/image/upload/v1738227298/z81qfpyoeklumutk1xvc.jpg"
      // ],
      shortenUrls: true,
    });

    // add a field isFromShare to true
    guest.isFromShare = true;
    await Rsvp.findOneAndUpdate(
      { event: eventId, contact: guest?.contact },
      guest,
      { upsert: true, new: true },
    );
  }

  for (const guest of guestWithEmails) {
    await sendMail(
      guest?.contact,
      `Invitation to ${hostName}'s event`,
      template(
        `Invitation to ${hostName}'s event`,
        `<p>Hi ${guest?.name}, You are invited to ${hostName}'s event. Please click on the link to join the event: <a href="${eventLink}?c=${guest?.contact}&n=${guest?.name}">Click here</a></p>`,
      ),
    );

    // add a field isFromShare to true
    guest.isFromShare = true;
    await Rsvp.findOneAndUpdate(
      { event: eventId, contact: guest?.contact },
      guest,
      { upsert: true, new: true },
    );
  }

  return {
    message: 'Event shared successfully',
  };
};

const getShares = async eventId => {
  const shares = await Share.find({ event: eventId });
  return shares;
};

export const ShareService = {
  sendMailToUser,
  shareEvent,
  getShares,
};
