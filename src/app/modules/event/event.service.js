import { Event } from './event.model.js';
import cloudinary from 'cloudinary';
import config from '../../../config/config.js';
import { sendMail } from '../../../utils/sendMail.js';
import mongoose from 'mongoose';
import { Share } from '../share/share.model.js';
import { Rsvp } from '../rsvp/rsvp.model.js';
import { Video } from '../video/video.model.js';
import cron from 'node-cron';
import twilio from 'twilio';
const client = twilio(config.twilio_sid, config.twilio_auth_token);
cloudinary.v2.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

const createOrUpdateEvent = async payload => {
  const existingEvent = await Event.findById(payload.eventId);
  if (existingEvent) {
    return await Event.findByIdAndUpdate(existingEvent._id, payload, {
      new: true,
    });
  }

  const newEvent = await Event.create(payload);
  return newEvent;
};

const updateEventCustomization = async (eventId, payload, files) => {
  const uploadPromises = [];

  if (files.eventLogo) {
    uploadPromises.push(
      cloudinary.v2.uploader.upload(files.eventLogo[0].path).then(result => {
        payload.eventLogo = result.secure_url;
      }),
    );
  }

  if (files.themeBackgroundImage) {
    uploadPromises.push(
      cloudinary.v2.uploader
        .upload(files.themeBackgroundImage[0].path)
        .then(result => {
          payload.themeBackgroundImage = result.secure_url;
        }),
    );
  }

  if (files.footerBackgroundImage) {
    uploadPromises.push(
      cloudinary.v2.uploader
        .upload(files.footerBackgroundImage[0].path)
        .then(result => {
          payload.footerBackgroundImage = result.secure_url;
        }),
    );
  }

  if (files.thumbnailImage) {
    uploadPromises.push(
      cloudinary.v2.uploader
        .upload(files.thumbnailImage[0].path)
        .then(result => {
          payload.thumbnailImage = result.secure_url;
        }),
    );
  }

  await Promise.all(uploadPromises);

  console.log({ payload });

  const event = await Event.findByIdAndUpdate(eventId, {
    customization: payload,
  });

  return event;
};

const getAllEvents = async user => {
  const role = user.role;
  let matchStage = {};
  if (role === 'user') {
    matchStage = { userEmail: user.email };
  }

  const events = await Event.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: 'videos',
        localField: 'video',
        foreignField: '_id',
        as: 'video',
      },
    },
    // {
    //   $lookup: {
    //     from: 'shares',
    //     localField: '_id',
    //     foreignField: 'event',
    //     as: 'share',
    //   },
    // },
    {
      $lookup: {
        from: 'rsvps',
        localField: '_id',
        foreignField: 'event',
        as: 'rsvps',
      },
    },
    // {
    //   $unwind: {
    //     path: '$share',
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
    {
      $unwind: {
        path: '$video',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  return events;
};
const getEventById = async id => {
  const event = await Event.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'videos',
        localField: 'video',
        foreignField: '_id',
        as: 'video',
      },
    },
    // {
    //   $lookup: {
    //     from: 'shares',
    //     localField: '_id',
    //     foreignField: 'event',
    //     as: 'share',
    //   },
    // },
    {
      $lookup: {
        from: 'rsvps',
        localField: '_id',
        foreignField: 'event',
        as: 'rsvps',
      },
    },
    { $unwind: { path: '$video', preserveNullAndEmptyArrays: true } },
    // { $unwind: { path: '$share', preserveNullAndEmptyArrays: true } },
    // { $unwind: { path: '$rsvps', preserveNullAndEmptyArrays: true } }
  ]);

  console.log({ event });

  return event[0];
};

const sendVideoPreviewInvite = async payload => {
  const event = await Event.findById(payload.eventId).select('userEmail');
  const html = `
    <p>Your video is ready! Please preview it now.</p>
    <p><a href="${payload.previewLink}">View Video</a></p>
    <p>Thank you!</p>
    <p>MailurInvited Team</p>`;
  const result = await sendMail(
    event.userEmail,
    'Your video is ready! Please preview it now.',
    html,
  );
  event.isUserNotified = true;
  await event.save();
  return result;
};

const deleteEvent = async id => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const event = await Event.findByIdAndDelete(id, { session });
    if (!event) {
      throw new Error('Event not found');
    }

    const videoId = event.video;

    if (videoId) {
      await Video.findByIdAndDelete(videoId, { session });
    }

    await Share.deleteMany({ event: id }, { session });
    await Rsvp.deleteMany({ event: id }, { session });

    await session.commitTransaction();
    session.endSession();
    return event;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const createComment = async payload => {
  const event = await Event.findByIdAndUpdate(
    payload.eventId,
    { $push: { videoComments: payload } },
    { new: true },
  );
  return event;
};

cron.schedule('* * * * *', async () => {
  // console.log('Sending reminders');
  const now = new Date();
  // console.log('🚀 ~ cron.schedule ~ now:', now);
  const recentPast = new Date(now.getTime() - 60 * 1000);

  try {
    const events = await Event.find({
      'eventDetails.autoReminderDate': { $gte: recentPast, $lte: now },
    });
    console.log({ events });
    const eventIds = events.map(event => event._id.toString());
    const rsvps = await Rsvp.find({
      event: { $in: eventIds },
      isReminderSent: { $ne: true }, // only get unsent ones
    });
    // Group RSVPs by eventId
    const rsvpsByEvent = {};
    rsvps.forEach(rsvp => {
      const eventId = rsvp.event.toString();
      if (!rsvpsByEvent[eventId]) {
        rsvpsByEvent[eventId] = [];
      }
      rsvpsByEvent[eventId].push(rsvp);
    });
    const allUpdatedRsvpIds = [];
    await Promise.all(
      events.map(async event => {
        const rsvpsForEvent = rsvpsByEvent[event._id.toString()] || [];
        if (rsvpsForEvent.length === 0) return;
        const firstEvent = event.eventDetails.events[0];
        const eventDateStr = new Date(firstEvent.startDate).toDateString();
        let timeStr = '';
        if (firstEvent.startTime) timeStr += ` at ${firstEvent.startTime}`;
        if (firstEvent.timeZone) timeStr += ` (${firstEvent.timeZone})`;
        const emailBody = `Hi! Just a reminder that your event "${firstEvent.title}" is scheduled for ${eventDateStr}${timeStr}.`;
        const emailContacts = rsvpsForEvent
          .filter(rsvp => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rsvp.contact))
          .map(rsvp => rsvp.contact);
        const phoneContacts = rsvpsForEvent
          .filter(rsvp => /^\+?[1-9]\d{1,14}$/.test(rsvp.contact))
          .map(rsvp => rsvp.contact);
        if (emailContacts.length > 0) {
          await sendMail(
            emailContacts,
            `Reminder: Your event "${firstEvent.title}" is coming up soon!`,
            emailBody,
          );
        }
        const phoneResults = await Promise.all(
          phoneContacts.map(contact =>
            client.messages.create({
              body: emailBody,
              from: config.twilio_phone_number,
              to: contact,
            }),
          ),
        );
        console.log({ phoneResults });
        allUpdatedRsvpIds.push(...rsvpsForEvent.map(rsvp => rsvp._id));
      }),
    );
    // Update RSVPs only once
    if (allUpdatedRsvpIds.length > 0) {
      await Rsvp.updateMany(
        { _id: { $in: allUpdatedRsvpIds } },
        { $set: { isReminderSent: true } },
      );
    }
  } catch (err) {
    console.error('Error sending reminders:', err);
  }
});

const sendMessageReminder = async payload => {
  const { to, subject, description } = payload;

  // detect if to is an phone number
  const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(to);
  let result;

  if (isPhoneNumber) {
    result = await client.messages.create({
      to: to,
      from: config.twilio_phone_number,
      body: `${subject}\n${description}`,
      shortenUrls: true,
    });
  } else {
    result = await sendMail(to, subject, description);
  }

  console.log({ result });

  return result;
};

const sendAnouncement = async payload => {
  const { eventId, subject, description } = payload;

  const rsvps = await Rsvp.find({ event: eventId });

  const phoneContacts = rsvps
    .filter(rsvp => /^\+?[1-9]\d{1,14}$/.test(rsvp.contact))
    .map(rsvp => rsvp.contact);

  const emailContacts = rsvps
    .filter(rsvp => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rsvp.contact))
    .map(rsvp => rsvp.contact);

  console.log({ phoneContacts, emailContacts });

  // detect if to is an phone number

  if (phoneContacts.length > 0) {
    await Promise.all(
      phoneContacts.map(contact =>
        client.messages.create({
          body: `${subject}\n${description}`,
          from: config.twilio_phone_number,
          to: contact,
        }),
      ),
    );
  }
  await sendMail(emailContacts, subject, description);

  return 'sent';
};

export const EventService = {
  createOrUpdateEvent,
  getAllEvents,
  getEventById,
  updateEventCustomization,
  sendVideoPreviewInvite,
  deleteEvent,
  createComment,
  sendMessageReminder,
  sendAnouncement,
};
