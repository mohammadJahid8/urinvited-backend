import express from 'express';
import { EventController } from './event.controller.js';
import multer from 'multer';
import auth from '../../middlewares/auth.js';

const router = express.Router();
const storage = multer.diskStorage({});

const upload = multer({ storage });

router.patch('/create', EventController.createOrUpdateEvent);

router.patch(
  '/customization/:id',
  upload.fields([
    { name: 'eventLogo' },
    { name: 'themeBackgroundImage' },
    { name: 'footerBackgroundImage' },
    { name: 'thumbnailImage' },
  ]),
  EventController.updateEventCustomization,
);

router.get('/', auth('user', 'admin'), EventController.getAllEvents);

router.get('/:id', EventController.getEventById);

router.post('/send-invite', EventController.sendVideoPreviewInvite);

router.delete('/:id', EventController.deleteEvent);

router.patch('/comment', EventController.createComment);

router.post('/send-message-reminder', EventController.sendMessageReminder);

router.post('/send-anouncement', EventController.sendAnouncement);

export const EventRoutes = router;
