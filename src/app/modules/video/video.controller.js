import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { VideoService } from "./video.service.js";

const uploadVideo = catchAsync(async (req, res) => {
  console.log(req.body, req.file)
  const result = await VideoService.uploadVideo(req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Video uploaded successfully!',
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
};
