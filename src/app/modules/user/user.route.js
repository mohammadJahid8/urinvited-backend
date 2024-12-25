import express from 'express';
import auth from '../../middlewares/auth.js';
import { UserController } from './user.controller.js';
const router = express.Router();

router.post('/signup', UserController.createUser);

router.get('/profile', auth('user', 'admin'), UserController.getUserProfile);

export const UserRoutes = router;
