import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import httpStatus from 'http-status';
import cron from 'node-cron';

import routes from './app/routes/routes.js';
import globalErrorHandler from './app/middlewares/globalErrorHandler.js';
import { sendMail } from './utils/sendMail.js';
import { Event } from './app/modules/event/event.model.js';

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

cron.schedule('* * * * *', async () => {
  // app.get('/reminder', async (req, res) => {

  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

  const start = new Date(today.setHours(0, 0, 0, 0)); // start of today
  const end = new Date(threeDaysLater.setHours(23, 59, 59, 999)); // end of day +3

  try {
    const events = await Event.find({
      'eventDetails.events.0.startDate': { $gte: start, $lte: end },
      isReminderSent: false,
    });

    const mailPromises = events.map(async doc => {
      const firstEvent = doc.eventDetails.events[0];
      const userEmail = doc.userEmail;

      const eventDateStr = new Date(firstEvent.startDate).toDateString();
      let timeStr = '';

      if (firstEvent.startTime) {
        timeStr += ` at ${firstEvent.startTime}`;
      }

      if (firstEvent.timeZone) {
        timeStr += ` (${firstEvent.timeZone})`;
      }

      const emailBody = `Hi! Just a reminder that your event "${firstEvent.title}" is scheduled for ${eventDateStr}${timeStr}.`;

      await sendMail(
        userEmail,
        `Reminder: Your event "${firstEvent.title}" is coming up soon!`,
        emailBody,
      );

      await Event.findByIdAndUpdate(doc._id, { isReminderSent: true });

      console.log(`Reminder sent to ${userEmail} for "${firstEvent.title}"`);
    });

    await Promise.all(mailPromises);
  } catch (err) {
    console.error('Error sending reminders:', err);
  }
});

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
