import express from 'express';
import { VideoController } from './video.controller.js';
import multer from 'multer';
const storage = multer.diskStorage({});

const upload = multer({ storage });
const router = express.Router();


router.post('/upload', upload.single('thumbnail'), VideoController.uploadVideo);

router.get('/', VideoController.getAllVideos);

export const VideoRoutes = router; 