import cloudinary from 'cloudinary';
import { Video } from './video.model.js';
import config from '../../../config/config.js';
import { Event } from '../event/event.model.js';
import { sendMail } from '../../../utils/sendMail.js';
import { template } from '../../../utils/emailTemplate.js';

cloudinary.v2.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

const uploadVideo = async (payload, file) => {
  console.log(payload, file);

  const session = await Video.startSession();
  session.startTransaction();
  try {
    payload.videos = [
      {
        url: payload.url,
      },
    ];

    const [newVideo] = await Video.create([payload], { session });

    if (file?.path) {
      const result = await cloudinary.v2.uploader.upload(file.path);
      newVideo.videos[0].thumbnail = result.secure_url;
      await newVideo.save({ session });
    }

    const [newEvent] = await Event.create(
      [
        {
          userEmail: payload.userEmail,
          video: newVideo._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return {
      eventId: newEvent._id,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const updateVideo = async (payload, file) => {
  if (file?.path) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    payload.thumbnail = result.secure_url;
  }

  const result = await Video.findByIdAndUpdate(
    payload.videoId,
    { $push: { videos: payload } },
    { new: true },
  );
  return result;
};

const approveVideo = async payload => {
  const result = await Video.findByIdAndUpdate(
    payload.videoId,
    { $set: { status: 'Approved' } },
    { new: true },
  );
  return result;
};

const createFeedback = async (payload, file) => {
  if (file?.path) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    payload.attachment = result.secure_url;
  }

  const result = await Video.findByIdAndUpdate(
    payload.videoId,
    { $push: { feedbacks: payload } },
    { new: true },
  );

  await sendMail(
    'info@urnotinvited.com',
    `Feedback from ${payload.email}`,
    template(
      `Feedback for video`,
      `
      <p>You have received a feedback regarding the video. Kindly review the details below and make the necessary updates:</p>
      <ul>
        <li><strong>Feedback Type:</strong> ${payload.feedbackType}</li>
        <li><strong>Feedback:</strong> ${payload.feedback}</li>
        <li><strong>Attachment:</strong> <a href="${payload.attachment}">View Attachment</a></li>
      </ul>
      `,
    ),
  );

  return result;
};

const getAllFeedbacks = async videoId => {
  const result = await Video.findById(videoId).select('feedbacks');
  return result;
};

const getAllVideos = async () => {
  const videos = await Video.find()
    .populate('uploadedBy')
    .sort({ createdAt: -1 });
  return videos;
};

export const VideoService = {
  uploadVideo,
  getAllVideos,
  createFeedback,
  getAllFeedbacks,
  updateVideo,
  approveVideo,
};
