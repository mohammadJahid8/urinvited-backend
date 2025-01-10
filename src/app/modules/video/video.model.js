import { Schema, model } from 'mongoose';

const VideoSchema = new Schema(
  {
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    userEmail: {
      type: String,
      // unique: true,
    },
    videos: [
      {
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        url: {
          type: String,
        },
        thumbnail: {
          type: String,
        },
      },
    ],

    eventDate: {
      type: Date,
    },
    canvaLink: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    feedbacks: [
      {
        feedbackType: String,
        feedback: String,
        attachment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);



export const Video = model('Video', VideoSchema);  
