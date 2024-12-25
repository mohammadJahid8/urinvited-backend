import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { AuthService } from './auth.service.js';

const loginUser = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

const loginWithGoogle = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginWithGoogle(loginData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in with google successfully !',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const bodyRefreshToken = req.body.refreshToken;

  console.log({ refreshToken, bodyRefreshToken });

  const result = await AuthService.refreshToken(
    refreshToken || bodyRefreshToken,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Token refreshed successfully!',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  await AuthService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully !',
  });
});

const forgotPass = catchAsync(async (req, res) => {
  const result = await AuthService.forgotPass(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Please check your email for OTP!',
    data: result,
  });
});

const verifyOtp = catchAsync(async (req, res) => {
  await AuthService.verifyOtp(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OTP verified successfully!',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  await AuthService.resetPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password reset successfully!',
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPass,
  verifyOtp,
  resetPassword,
  loginWithGoogle,
};
