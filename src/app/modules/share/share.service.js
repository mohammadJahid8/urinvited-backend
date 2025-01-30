import config from "../../../config/config.js";
import httpStatus from "http-status";
import { template } from "../../../utils/emailTemplate.js";
import { sendMail } from "../../../utils/sendMail.js";
import twilio from "twilio";
import { Share } from "./share.model.js";
import ApiError from "../../../errors/ApiError.js";

const client = twilio(config.twilio_sid, config.twilio_auth_token);


const sendMailToUser = async (data) => {
  const { subject, body, to } = data;
  const emailTemplate = template(subject, body);

  const result = await sendMail(to, subject, emailTemplate);
  return result;
};
const shareEvent = async (data) => {
  const { eventLink, guests, hostName, eventId } = data;



  if (!eventId || !Array.isArray(guests)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payload');
  }

  // Find the document with the specified event ID
  let shareDoc = await Share.findOne({ event: eventId });

  if (!shareDoc) {
    // If no document exists, create a new one
    shareDoc = new Share({ event: eventId, guests });
  } else {

    const existingGuests = shareDoc.guests;


    guests.forEach((guest) => {
      // Check if the guest already exists in existingGuests
      const existingIndex = existingGuests.findIndex(
        (existingGuest) =>
          existingGuest.email === guest.email && existingGuest.phone === guest.phone
      );

      if (existingIndex !== -1) {
        // Update the existing guest
        existingGuests[existingIndex] = {
          ...existingGuests[existingIndex],
          ...guest,
        };
      } else {
        // Add the new guest
        existingGuests.push(guest);
      }
    });

    shareDoc.guests = existingGuests;

  }


  await shareDoc.save();
  const guestWithEmail = guests
    ?.filter((guest) => guest?.email)
    .filter(Boolean);
  const guestWithPhone = guests
    ?.filter((guest) => guest?.phone)
    .filter(Boolean);

  for (const guest of guestWithPhone) {
    await client.messages.create({
      to: "+8801633909408",
      // to: guest?.phone,
      from: '+18335771907', //1(833)5771907
      body: `Hi ${guest?.name}, You are invited to ${hostName}'s event. Please click on the link to join the event: ${eventLink}`,
    });
  }




  for (const guest of guestWithEmail) {
    await sendMail(guest?.email, `Invitation to ${hostName}'s event`, template(`Invitation to ${hostName}'s event`, `<p>Hi ${guest?.name}, You are invited to ${hostName}'s event. Please click on the link to join the event: <a href="${eventLink}?e=${guest?.email || guest?.phone}&n=${guest?.name}">${eventLink}</a></p>`));
  }
  return {
    message: "Event shared successfully",
  };
};

const getShares = async (eventId) => {
  const shares = await Share.find({ event: eventId });
  return shares;
};

export const ShareService = {
  sendMailToUser,
  shareEvent,
  getShares,
};
