import express from 'express';
import { ShareController } from './share.controller.js';

const router = express.Router();

router.post('/send-mail', ShareController.sendMailToUser);
router.post('/', ShareController.shareEvent);
router.get('/:id', ShareController.getShares);
export const ShareRoutes = router;