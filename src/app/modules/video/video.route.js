import express from 'express';
import { VideoController } from './video.controller.js';
import multer from 'multer';
const storage = multer.diskStorage({});

const upload = multer({ storage });
const router = express.Router();


router.post('/upload', upload.single('thumbnail'), VideoController.uploadVideo);

router.get('/', VideoController.getAllVideos);

router.patch('/update', upload.single('thumbnail'), VideoController.updateVideo);

router.patch('/approve', VideoController.approveVideo);

router.patch('/feedback', upload.single('attachment'), VideoController.createFeedback);

router.get('/feedback/:videoId', VideoController.getAllFeedbacks);

export const VideoRoutes = router; 