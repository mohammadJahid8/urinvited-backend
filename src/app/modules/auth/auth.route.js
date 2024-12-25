import express from 'express';
import auth from '../../middlewares/auth.js';
import { AuthController } from './auth.controller.js';
const router = express.Router();

router.post('/login', AuthController.loginUser);
router.post('/google', AuthController.loginWithGoogle);
router.post('/refresh-token', AuthController.refreshToken);

router.post('/change-password', auth('user'), AuthController.changePassword);
router.post('/forgot-password', AuthController.forgotPass);
router.post('/verify-otp', AuthController.verifyOtp);

router.post('/reset-password', AuthController.resetPassword);

export const AuthRoutes = router;
