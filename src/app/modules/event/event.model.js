import { Schema, model } from 'mongoose';
const EventSchema = new Schema(
  {
    hostedBy: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    userEmail: {
      type: String,
    },
    isUserNotified: {
      type: Boolean,
      default: false,
    },
    isReminderSent: {
      type: Boolean,
      default: false,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: false,
    },
    eventDetails: {
      events: [
        {
          title: {
            type: String,
          },
          inviteDetails: {
            type: String,
          },
          when: {
            enum: ['startDateTime', 'tbd'],
            type: String,
          },
          startDate: {
            type: Date,
          },
          startTime: {
            type: String,
          },
          timeZone: {
            type: String,
          },
          endDate: {
            type: Date,
          },
          endTime: {
            type: String,
          },
          locationType: {
            type: String,
            enum: ['in-person', 'virtual'],
          },
          locationName: {
            type: String,
          },
          latLng: {
            lat: {
              type: String,
            },
            lng: {
              type: String,
            },
          },
          address: {
            type: String,
          },
          showGoogleMap: {
            type: Boolean,
            default: false,
          },
          virtualPlatformName: {
            type: String,
          },
          virtualUrl: {
            type: String,
          },
        },
      ],
      isRsvpDueDateSet: {
        type: Boolean,
      },
      requestRsvps: {
        type: Boolean,
      },
      rsvpDueDate: {
        type: Date,
      },
      allowRsvpAfterDueDate: {
        type: Boolean,
      },

      isAutoReminderSet: {
        type: Boolean,
      },
      autoReminderDate: {
        type: Date,
      },
      allowAdditionalAttendees: {
        type: Boolean,
      },
      isMaximumCapacitySet: {
        type: Boolean,
      },
      additionalAttendees: {
        type: String,
      },
      maximumCapacity: {
        type: String,
      },
    },
    customization: {
      isEventLogoEnabled: {
        type: Boolean,
      },
      eventLogo: {
        type: String,
      },
      isThemeBackgroundImageEnabled: {
        type: Boolean,
      },
      themeBackgroundImage: {
        type: String,
      },
      isFooterBackgroundImageEnabled: {
        type: Boolean,
      },
      footerBackgroundImage: {
        type: String,
      },
      isThumbnailImageEnabled: {
        type: Boolean,
      },
      thumbnailImage: {
        type: String,
      },
      textColour: {
        type: String,
      },
      headingFont: {
        type: String,
      },
      dateTimeLocationFont: {
        type: String,
      },
      descriptionFont: {
        type: String,
      },
      buttonFont: {
        type: String,
      },
      buttonText: {
        type: String,
      },
      buttonColour: {
        type: String,
      },
      buttonFormat: {
        type: String,
      },
      isAddToCalendar: {
        type: Boolean,
      },
      reactToEvent: {
        type: Boolean,
      },
      shareEvent: {
        type: Boolean,
      },
      commentOnEvent: {
        type: Boolean,
      },
    },
    additionalFeatures: {
      registry: [
        {
          title: {
            type: String,
          },
          description: {
            type: String,
          },
          url: {
            type: String,
          },
          buttonText: {
            type: String,
          },
        },
      ],
      // customFields: [
      //   {
      //     title: {
      //       type: String,
      //     },
      //     description: {
      //       type: String,
      //     },
      //     buttonText: {
      //       type: String,
      //     },
      //     buttonUrl: {
      //       type: String,
      //     },
      //   }
      // ],
      accommodation: [
        {
          accommodationName: {
            type: String,
          },
          location: {
            type: String,
          },
          note: {
            type: String,
          },
        },
      ],
      travelSource: {
        type: String,
      },
      travelSourceLink: {
        type: String,
      },
    },
    videoComments: [
      {
        comment: {
          type: String,
        },
        name: {
          type: String,
        },
        email: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Event = model('Event', EventSchema);
