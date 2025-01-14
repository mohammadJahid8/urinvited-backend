import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { ShareService } from "./share.service.js";


const sendMailToUser = catchAsync(async (req, res) => {
  const result = await ShareService.sendMailToUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mail sent successfully!',
    data: result,
  });
});

const shareEvent = catchAsync(async (req, res) => {
  const result = await ShareService.shareEvent(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event shared successfully!',
    data: result,
  });
});

export const ShareController = {
  sendMailToUser,
  shareEvent,
};
