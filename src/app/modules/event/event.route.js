import express from 'express';
import { EventController } from './event.controller.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.diskStorage({});

const upload = multer({ storage });

router.patch('/create', EventController.createOrUpdateEvent);

router.patch('/customization/:id', upload.fields([{ name: 'eventLogo' }, { name: 'themeBackgroundImage' }, { name: 'footerBackgroundImage' }, { name: 'thumbnailImage' }]), EventController.updateEventCustomization);

router.get('/', EventController.getAllEvents);

router.get('/:id', EventController.getEventById);

router.post('/send-invite', EventController.sendVideoPreviewInvite);

export const EventRoutes = router; 