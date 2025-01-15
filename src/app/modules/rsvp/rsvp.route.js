import express from 'express';
import { RsvpController } from './rsvp.controller.js';

const router = express.Router();

router.post('/', RsvpController.createOrUpdateRsvp);
router.get('/:eventId', RsvpController.getRsvpByContact);
router.get('/event/:id', RsvpController.getRsvpByEvent);
export const RsvpRoutes = router;