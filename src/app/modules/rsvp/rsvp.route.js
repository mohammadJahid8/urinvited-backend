import express from 'express';
import { RsvpController } from './rsvp.controller.js';

const router = express.Router();

router.post('/', RsvpController.createOrUpdateRsvp);
router.get('/:eventId', RsvpController.getRsvpByContact);
router.get('/event/:id', RsvpController.getRsvpByEvent);
router.delete('/:id', RsvpController.deleteRsvp);
router.patch('/:id', RsvpController.updateRsvp);
export const RsvpRoutes = router;