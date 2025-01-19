import { Rsvp } from "./rsvp.model.js";

const createOrUpdateRsvp = async (payload) => {
  const { event, contact
  } = payload;
  const rsvp = await Rsvp.findOneAndUpdate({ event, contact }, payload, { upsert: true, new: true });
  return rsvp;
};
const updateRsvp = async (id, payload) => {
  const rsvp = await Rsvp.findByIdAndUpdate(id, payload, { upsert: true, new: true });
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

const deleteRsvp = async (id) => {
  const rsvp = await Rsvp.findByIdAndDelete(id);
  return rsvp;
};

export const RsvpService = {
  createOrUpdateRsvp,
  updateRsvp,
  getRsvpByContact,
  getRsvpByEvent,
  deleteRsvp,
};

