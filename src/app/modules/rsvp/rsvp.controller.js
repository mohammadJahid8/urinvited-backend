import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { RsvpService } from "./rsvp.service.js";


const createOrUpdateRsvp = catchAsync(async (req, res) => {
  const result = await RsvpService.createOrUpdateRsvp(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'RSVP created successfully!',
    data: result,
  });
});

const getRsvpByContact = catchAsync(async (req, res) => {
  const result = await RsvpService.getRsvpByContact(req.params.eventId, req.query.contact);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'RSVP fetched successfully!',
    data: result,
  });
});
const getRsvpByEvent = catchAsync(async (req, res) => {
  const result = await RsvpService.getRsvpByEvent(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'RSVP fetched successfully!',
    data: result,
  });
});


export const RsvpController = {
  createOrUpdateRsvp,
  getRsvpByContact,
  getRsvpByEvent,
};
