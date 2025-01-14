import config from "../../../config/config.js";
import { template } from "../../../utils/emailTemplate.js";
import { sendMail } from "../../../utils/sendMail.js";
import twilio from "twilio";
import { Share } from "./share.model.js";

const client = twilio(config.twilio_sid, config.twilio_auth_token);


const sendMailToUser = async (data) => {
  const { subject, body, to } = data;
  const emailTemplate = template(subject, body);

  const result = await sendMail(to, subject, emailTemplate);
  return result;
};
const shareEvent = async (data) => {
  const { eventLink, guests, hostName, eventId } = data;

  console.log("ddata", data)

  await Share.create({
    event: eventId,
    guests: guests,
  });

  const guestWithEmail = guests
    ?.filter((guest) => guest?.email)
    .filter(Boolean);
  const guestWithPhone = guests
    ?.filter((guest) => guest?.phone)
    .filter(Boolean);

  // for (const guest of guestWithPhone) {
  //   await client.messages.create({
  //     to: "+8801633909408",
  //     // to: guest?.phone,
  //     from: '+16812812720',
  //     body: `Hi ${guest?.name}, You are invited to ${hostName}'s event. Please click on the link to join the event: ${eventLink}`,
  //   });
  // }




  for (const guest of guestWithEmail) {
    await sendMail(guest?.email, `Invitation to ${hostName}'s event`, template(`Invitation to ${hostName}'s event`, `<p>Hi ${guest?.name}, You are invited to ${hostName}'s event. Please click on the link to join the event: <a href="${eventLink}?e=${guest?.email || guest?.phone}&n=${guest?.name}">${eventLink}</a></p>`));
  }
  return {
    message: "Event shared successfully",
  };
};

export const ShareService = {
  sendMailToUser,
  shareEvent,
};
