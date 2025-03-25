import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import httpStatus from 'http-status';

import routes from './app/routes/routes.js';
import globalErrorHandler from './app/middlewares/globalErrorHandler.js';

const app = express();

// const corsOptions = {
//   origin: true,
//   credentials: true,
// };

app.use(cors());
app.use(cookieParser());

// parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// all routes
app.use('/api/v1', routes);

// cron.schedule('* * * * *', async () => {
// app.get('/reminder', async (req, res) => {
//   const now = new Date('2025-03-24T18:00:00.000+00:00');
//   const nextMinute = new Date(now.getTime() + 60 * 1000);

//   try {
//     const events = await Event.find({
//       'eventDetails.autoReminderDate': { $gte: now, $lt: nextMinute },
//     });

//     const eventIds = events.map(event => event._id.toString());

//     const rsvps = await Rsvp.find({
//       event: { $in: eventIds },
//       isReminderSent: { $ne: true }, // only get unsent ones
//     });

//     // Group RSVPs by eventId
//     const rsvpsByEvent = {};
//     rsvps.forEach(rsvp => {
//       const eventId = rsvp.event.toString();
//       if (!rsvpsByEvent[eventId]) {
//         rsvpsByEvent[eventId] = [];
//       }
//       rsvpsByEvent[eventId].push(rsvp);
//     });

//     const allUpdatedRsvpIds = [];

//     await Promise.all(
//       events.map(async event => {
//         const rsvpsForEvent = rsvpsByEvent[event._id.toString()] || [];

//         if (rsvpsForEvent.length === 0) return;

//         const firstEvent = event.eventDetails.events[0];
//         const eventDateStr = new Date(firstEvent.startDate).toDateString();

//         let timeStr = '';
//         if (firstEvent.startTime) timeStr += ` at ${firstEvent.startTime}`;
//         if (firstEvent.timeZone) timeStr += ` (${firstEvent.timeZone})`;

//         const emailBody = `Hi! Just a reminder that your event "${firstEvent.title}" is scheduled for ${eventDateStr}${timeStr}.`;

//         const emailContacts = rsvpsForEvent
//           .filter(rsvp => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rsvp.contact))
//           .map(rsvp => rsvp.contact);

//         const phoneContacts = rsvpsForEvent
//           .filter(rsvp => /^\+?[1-9]\d{1,14}$/.test(rsvp.contact))
//           .map(rsvp => rsvp.contact);

//         if (emailContacts.length > 0) {
//           await sendMail(
//             emailContacts,
//             `Reminder: Your event "${firstEvent.title}" is coming up soon!`,
//             emailBody,
//           );
//         }

//         await Promise.all(
//           phoneContacts.map(contact =>
//             client.messages.create({
//               body: emailBody,
//               from: config.twilio_phone_number,
//               to: contact,
//             }),
//           ),
//         );

//         allUpdatedRsvpIds.push(...rsvpsForEvent.map(rsvp => rsvp._id));
//       }),
//     );

//     // Update RSVPs only once
//     if (allUpdatedRsvpIds.length > 0) {
//       await Rsvp.updateMany(
//         { _id: { $in: allUpdatedRsvpIds } },
//         { $set: { isReminderSent: true } },
//       );
//     }

//     res.send('Reminders sent successfully');
//   } catch (err) {
//     console.error('Error sending reminders:', err);
//     res.status(500).send('Something went wrong while sending reminders');
//   }
// });

app.get('/', (req, res) => {
  res.send('Welcome to event server !');
});

// global error handler
app.use(globalErrorHandler);

// handle not found routes
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: `Can't find ${req.originalUrl} on event server!`,
    errorMessages: [
      {
        path: req.originalUrl,
        message: `Api not found!`,
      },
    ],
  });
  next();
});

export default app;
