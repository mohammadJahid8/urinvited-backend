import express from 'express';
import { ShareController } from './share.controller.js';

const router = express.Router();

router.post('/send-mail', ShareController.sendMailToUser);
router.post('/', ShareController.shareEvent);
export const ShareRoutes = router;