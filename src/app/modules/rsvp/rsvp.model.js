import { Schema, model } from 'mongoose';

const RsvpSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    contact: {
      type: String,
    },

    name: {
      type: String,
    },

    rsvpStatus: {
      type: String,
      enum: ['yes', 'no', 'maybe', 'pending'],
      default: 'pending',
    },

    message: {
      type: String,
    },

    reaction: {
      type: String
    },

    guests: [
      {
        guestId: {
          type: String,
        },
        name: {
          type: String,
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
        },
        isAdult: {
          type: Boolean,
          default: true,
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);


export const Rsvp = model('Rsvp', RsvpSchema);   
