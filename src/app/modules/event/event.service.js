import { Event } from './event.model.js';
import cloudinary from 'cloudinary';
import config from '../../../config/config.js';
import { sendMail } from '../../../utils/sendMail.js';
import mongoose from 'mongoose';

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
      })
    );
  }

  if (files.themeBackgroundImage) {
    uploadPromises.push(
      cloudinary.v2.uploader.upload(files.themeBackgroundImage[0].path).then(result => {
        payload.themeBackgroundImage = result.secure_url;
      })
    );
  }

  if (files.footerBackgroundImage) {
    uploadPromises.push(
      cloudinary.v2.uploader.upload(files.footerBackgroundImage[0].path).then(result => {
        payload.footerBackgroundImage = result.secure_url;
      })
    );
  }

  if (files.thumbnailImage) {
    uploadPromises.push(
      cloudinary.v2.uploader.upload(files.thumbnailImage[0].path).then(result => {
        payload.thumbnailImage = result.secure_url;
      })
    );
  }

  await Promise.all(uploadPromises);

  console.log({ payload })

  const event = await Event.findByIdAndUpdate(eventId, { customization: payload });

  return event;
};


const getAllEvents = async (user) => {
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
        as: 'video'
      }
    },
    {
      $lookup: {
        from: 'shares',
        localField: '_id',
        foreignField: 'event',
        as: 'share'
      }
    },
    {
      $lookup: {
        from: 'rsvps',
        localField: '_id',
        foreignField: 'event',
        as: 'rsvps'
      }
    },
    {
      $unwind: {
        path: '$share',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$video',
        preserveNullAndEmptyArrays: true
      }
    }
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
        as: 'video'
      }
    },
    {
      $lookup: {
        from: 'shares',
        localField: '_id',
        foreignField: 'event',
        as: 'share'
      }
    },
    {
      $lookup: {
        from: 'rsvps',
        localField: '_id',
        foreignField: 'event',
        as: 'rsvps'
      }
    },
    { $unwind: { path: '$video', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$share', preserveNullAndEmptyArrays: true } },
    // { $unwind: { path: '$rsvps', preserveNullAndEmptyArrays: true } }
  ]);

  console.log({ event })

  return event[0];
};

const sendVideoPreviewInvite = async (payload) => {
  const event = await Event.findById(payload.eventId).select('userEmail');
  const html = `
    <p>Your video is ready! Please preview it now.</p>
    <p><a href="${payload.previewLink}">View Video</a></p>
    <p>Thank you!</p>
    <p>MailurInvited Team</p>`;
  const result = await sendMail(event.userEmail, 'Your video is ready! Please preview it now.', html);
  event.isUserNotified = true;
  await event.save();
  return result;
};



export const EventService = {
  createOrUpdateEvent,
  getAllEvents,
  getEventById,
  updateEventCustomization,
  sendVideoPreviewInvite,
};
