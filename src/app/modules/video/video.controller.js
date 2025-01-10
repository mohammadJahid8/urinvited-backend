import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { VideoService } from "./video.service.js";

const uploadVideo = catchAsync(async (req, res) => {
  const result = await VideoService.uploadVideo(req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Video uploaded successfully!',
    data: result,
  });
});

const updateVideo = catchAsync(async (req, res) => {
  const result = await VideoService.updateVideo(req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Video updated successfully!',
    data: result,
  });
});

const approveVideo = catchAsync(async (req, res) => {
  const result = await VideoService.approveVideo(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Video approved successfully!',
    data: result,
  });
});
const createFeedback = catchAsync(async (req, res) => {
  const result = await VideoService.createFeedback(req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback created successfully!',
    data: result,
  });
});

const getAllFeedbacks = catchAsync(async (req, res) => {
  const result = await VideoService.getAllFeedbacks(req.params.videoId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedbacks fetched successfully!',
    data: result,
  });
});

const getAllVideos = catchAsync(async (req, res) => {
  const result = await VideoService.getAllVideos();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Videos fetched successfully!',
    data: result,
  });
});

export const VideoController = {
  uploadVideo,
  getAllVideos,
  createFeedback,
  getAllFeedbacks,
  updateVideo,
  approveVideo
};
