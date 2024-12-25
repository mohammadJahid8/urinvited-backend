import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { User } from './user.model.js';


const createUser = async (user) => {
  const existingUser = await User.isUserExist(user.email);
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const existingGoogleUser = await User.isGoogleUser(user.email);
  if (existingGoogleUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User already exists with google!'
    );
  }


  const newUser = await User.create(user);

  if (!newUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
  }

  return newUser;
};

const updateUser = async (payload, user) => {
  const result = await User.findOneAndUpdate({ email: user.email }, payload, {
    new: true,
  });
  return result;
};


const getUserProfile = async (user) => {

  const result = await User.findOne({ email: user.email });
  return result;
};

export const UserService = {
  createUser,
  updateUser,
  getUserProfile,

};
