import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { User } from '../user/user.model.js';

import { sendEmail } from './sendResetMail.js';
import { jwtHelpers } from '../../../helpers/jwtHelper.js';
import config from '../../../config/config.js';

const loginUser = async (payload) => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);


  // console.log('🚀 ~ loginUser ~ isUserExist:', isUserExist);
  const isGoogleUser = await User.isGoogleUser(payload.email);

  if (isGoogleUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Your account is associated with google! Please use google login.'
    );
  }

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect');
  }

  //create access token & refresh token

  const { email: userEmail, role, _id } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { email: userEmail, role, _id },
    config.jwt.secret,
    config.jwt.expires_in
  );



  return {
    role,
    accessToken,
  };
};

const loginWithGoogle = async (payload) => {
  const { email, role } = payload;

  const isUserExist = await User.isUserExist(email);
  console.log({ email, isUserExist });

  const isGoogleUser = await User.isGoogleUser(email);


  if (isUserExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User already exists with email!'
    );
  }

  const { _id } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { email, role, _id },
    config.jwt.secret,
    config.jwt.expires_in
  );



  if (!isGoogleUser) {
    payload.isGoogleUser = true;
    await User.create(payload);
  }

  return {
    accessToken,
    role,
  };
};

const refreshToken = async (token) => {

  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { email } = verifiedToken;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
      _id: isUserExist._id,
    },
    config.jwt.secret,
    config.jwt.expires_in
  );


  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (user, payload) => {
  const { oldPassword, password } = payload;

  //alternative way
  const isUserExist = await User.findOne({ id: user?.userId }).select(
    '+password'
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }


  isUserExist.password = password;

  // updating using save()
  isUserExist.save();
};

const forgotPass = async (payload) => {
  const isGoogleUser = await User.isGoogleUser(payload.email);

  if (isGoogleUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This user is associated with Google! Please use Google login.'
    );
  }

  const user = await User.findOne(
    { email: payload.email, isGoogleUser: false },
    { email: 1, role: 1, _id: 1 }
  );

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!');
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000 + 10 * 1000); // 2 minutes 10 seconds expiry

  // Save OTP and its expiration in the user's record
  await User.updateOne({ email: user.email }, { otp, otpExpiry });

  // Send the OTP to the user's email
  await sendEmail(
    user.email,
    `
      <div>
        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 2 minutes.</p>
        <p>Thank you</p>
      </div>
    `
  );

  return {
    otpExpiry,
  };
};

const verifyOtp = async (payload) => {
  const { email, otp } = payload;

  const user = await User.findOne({ email }, { otp: 1, otpExpiry: 1 });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  if (!user.otp || !user.otpExpiry || new Date() > user.otpExpiry) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'OTP has expired or is invalid!'
    );
  }

  if (user.otp !== otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP!');
  }

  // Mark user as verified for password reset
  await User.updateOne(
    { email },
    { otp: null, otpExpiry: null, canResetPassword: true }
  );
};

const resetPassword = async (payload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }, { canResetPassword: 1 });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  if (!user.canResetPassword) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Password reset not allowed. Verify OTP first!'
    );
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bycrypt_salt_rounds)
  );

  // Update the user's password and reset the eligibility flag
  await User.updateOne(
    { email },
    { password: hashedPassword, canResetPassword: false }
  );
};

export const AuthService = {
  loginUser,
  loginWithGoogle,
  refreshToken,
  changePassword,
  forgotPass,
  resetPassword,
  verifyOtp,
};
