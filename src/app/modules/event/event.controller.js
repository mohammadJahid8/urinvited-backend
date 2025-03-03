import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { EventService } from "./event.service.js";

const createOrUpdateEvent = catchAsync(async (req, res) => {
  const result = await EventService.createOrUpdateEvent(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event created successfully!',
    data: result,
  });
});

const updateEventCustomization = catchAsync(async (req, res) => {
  const parsedData = JSON.parse(req.body.data)
  console.log("req.body", parsedData, req.files)
  const result = await EventService.updateEventCustomization(req.params.id, parsedData, req.files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event customization updated successfully!',
    data: result,
  });
});

const getAllEvents = catchAsync(async (req, res) => {
  const result = await EventService.getAllEvents(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Events fetched successfully!',
    data: result,
  });
});
const getEventById = catchAsync(async (req, res) => {
  const result = await EventService.getEventById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event fetched successfully!',
    data: result,
  });
});
const sendVideoPreviewInvite = catchAsync(async (req, res) => {
  const result = await EventService.sendVideoPreviewInvite(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Video preview invite sent successfully!',
    data: result,
  });
});

const deleteEvent = catchAsync(async (req, res) => {
  const result = await EventService.deleteEvent(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event deleted successfully!',
    data: result,
  });
});

const createComment = catchAsync(async (req, res) => {
  const result = await EventService.createComment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment created successfully!',
    data: result,
  });
});

export const EventController = {
  createOrUpdateEvent,
  getAllEvents,
  getEventById,
  updateEventCustomization,
  sendVideoPreviewInvite,
  deleteEvent,
  createComment,
};
