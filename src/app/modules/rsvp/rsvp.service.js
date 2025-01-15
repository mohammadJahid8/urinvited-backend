import { Rsvp } from "./rsvp.model.js";

const createOrUpdateRsvp = async (payload) => {
  const { event, contact
  } = payload;
  const rsvp = await Rsvp.findOneAndUpdate({ event, contact }, payload, { upsert: true, new: true });
  return rsvp;
};

const getRsvpByContact = async (eventId, contact) => {
  const rsvp = await Rsvp.findOne({ event: eventId, contact });
  return rsvp;
};

const getRsvpByEvent = async (event) => {
  const rsvp = await Rsvp.find({ event });
  return rsvp;
};

export const RsvpService = {
  createOrUpdateRsvp,
  getRsvpByContact,
  getRsvpByEvent,
};
