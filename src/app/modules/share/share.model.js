import { Schema, model } from 'mongoose';

const ShareSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    guests: [
      {
        name: {
          type: String,
        },
        contact: {
          type: String,
        },
        // phone: {
        //   type: String,
        // },
        isAdult: {
          type: Boolean,
          default: true,
        },
        extraGuests: [
          {
            _id: false,
            name: {
              type: String,
            },
            isAdult: {
              type: Boolean,
              default: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Share = model('Share', ShareSchema);
