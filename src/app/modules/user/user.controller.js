import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { UserService } from './user.service.js';

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Signup successful! Please login to continue.',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const data = JSON.parse(req.body.data || '{}');
  console.log('req.body.data', data, req.file);

  if (Object.keys(data).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data is required');
  }

  const result = await UserService.updateUser(data, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully!',
    data: result,
  });
});

const updateOrCreateUserPersonalInformation = catchAsync(
  async (req, res) => {
    const data = JSON.parse(req.body.data || '{}');

    const result = await UserService.updateOrCreateUserPersonalInformation(
      data,
      req.user,
      req.file
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User personal information updated successfully!',
      data: result,
    });
  }
);
const updateOrCreateUserProfessionalInformation = catchAsync(
  async (req, res) => {
    const data = JSON.parse(req.body.data || '{}');
    const files = req.files;

    const result = await UserService.updateOrCreateUserProfessionalInformation(
      data,
      req.user,
      files
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User professional information updated successfully!',
      data: result,
    });
  }
);
const updateOrCreateUserDocuments = catchAsync(
  async (req, res) => {
    const files = req.files;
    const payload = JSON.parse(req.body.data || '{}');

    const result = await UserService.updateOrCreateUserDocuments(
      req.user,
      files,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User documents updated successfully!',
      data: result,
    });
  }
);



const getUserProfile = catchAsync(
  async (req, res) => {
    const result = await UserService.getUserProfile(req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User profile retrieved successfully!',
      data: result,
    });
  }
);

export const UserController = {
  createUser,
  updateUser,
  getUserProfile,
  updateOrCreateUserPersonalInformation,
  updateOrCreateUserProfessionalInformation,
  updateOrCreateUserDocuments,
};
