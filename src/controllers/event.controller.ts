import { Request, Response } from "express";
import { logger } from "../utils/logger";
import {
  createEventValidaton,
  createUpdateEventValidation,
} from "../validations/event.validation";
import {
  addEventToDB,
  countTotalEvents,
  countTotalEventsByCategory,
  countTotalEventsByTitle,
  deleteEventById,
  getEventByCategoryFromDB,
  getEventByIdFromDB,
  getEventByNameFromDB,
  getEventFromDB,
  updateEventById,
} from "../services/eventService";
import { v4 } from "uuid";
import { getPagination } from "../utils/pagination";
import { deleteImage, uploadImage } from "../utils/upload.image";

export const getEvent = async (req: Request, res: Response) => {
  let total;
  let events;
  let pagination;

  const {
    params: { id },
  } = req;
  const search: string =
    typeof req.query.search === "string" ? req.query.search : "";
  const numberPage: number = Number(req.query.page) || 1;
  const limit: number = Number(req.query.limit) || 2;

  const category = req.query.category?.toString();

  if (id) {
    const event = await getEventByIdFromDB(id);
    if (event) {
      logger.info("Successfully retrieved the list.");
      return res.status(200).send({
        statusCode: 200,
        type: true,
        data: event,
      });
    } else {
      logger.info("Event by ID not found");
      return res.status(400).send({
        statusCode: 400,
        type: false,
        message: "Event by ID not found",
      });
    }
  }

  if (category) {
    total = await countTotalEventsByCategory(category);
    events = await getEventByCategoryFromDB(category);
    pagination = getPagination(total, limit, numberPage);

    return res.status(200).send({
      pagination: {
        last_page: pagination.lastPage,
        current_page: numberPage,
        next_page: pagination.nextPage,
        items: {
          count: events.length,
          total,
          per_page: limit,
        },
      },
      data: events,
    });
  }

  if (search.length >= 3) {
    total = await countTotalEventsByTitle(search);
    events = await getEventByNameFromDB(search);
    pagination = getPagination(total, limit, numberPage);

    return res.status(200).send({
      pagination: {
        last_page: pagination.lastPage,
        current_page: numberPage,
        next_page: pagination.nextPage,
        items: {
          count: events.length,
          total,
          per_page: limit,
        },
      },
      data: events,
    });
  }

  // else
  total = await countTotalEvents();
  events = await getEventFromDB(numberPage, limit);
  pagination = getPagination(total, limit, numberPage);

  logger.info("Successfully retrieved the list of events.");
  return res.status(200).send({
    pagination: {
      last_page: pagination.lastPage,
      current_page: numberPage,
      next_page: pagination.nextPage,
      items: {
        count: events.length,
        total,
        per_page: limit,
      },
    },
    data: events,
  });
};

export const createEvent = async (req: Request, res: Response) => {
  req.body.event_id = v4();
  const user = res.locals.user;

  if (user) {
    req.body.author = {
      user_id: user._doc.user_id,
      username: user._doc.username,
      email: user._doc.email,
      role: user._doc.role,
    };
  }

  const { error, value } = createEventValidaton(req.body);

  if (error) {
    logger.info(`ERR = ${error.details[0].message}`);
    return res.status(422).send({
      statusCode: 422,
      type: false,
      message: error.details[0].message,
    });
  }

  if (!req.file) {
    return res.status(400).send({
      type: false,
      statusCode: 400,
      message: "Image require",
    });
  }

  if (req.file) {
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
    try {
      const buildImage = await uploadImage(file, "single");
      value.image = buildImage;
    } catch (error) {
      logger.info("failed create event");
      logger.error(`${error}`);
      return res.status(422).send({
        message: error,
      });
    }
  }

  try {
    const event = await addEventToDB(value);
    logger.info("Succes create event");
    return res.status(201).send({
      statusCode: 201,
      type: true,
      data: event,
    });
  } catch (error) {
    logger.info("failed create event");
    logger.error(`${error}`);
    await deleteImage(value.image.fileName);
    return res.status(422).send({
      data: value.image,
      message: error,
    });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const id = req.params.id;

  const { error, value } = createUpdateEventValidation(req.body);
  if (error) {
    logger.info(`FAILED UPATE EVENT`);
    logger.error(`error: ${error.details[0].message}`);
    return res.send({
      message: error.details[0].message,
    });
  }
  try {
    const result = await updateEventById(id, value);
    if (result) {
      logger.info(`Succes update event`);
      return res.status(200).send({
        statusCode: 200,
        type: true,
        data: value,
      });
    } else {
      logger.info(`Event not found`);
      return res.status(404).send({
        statusCode: 404,
        type: false,
        message: "Event not found",
      });
    }
  } catch (error) {
    logger.info("Failed delete event");
    logger.error(`Error: ${error}`);
    return res.status(400).send({
      statusCode: 400,
      type: false,
      message: error,
    });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const event = await getEventByIdFromDB(id);
    await deleteImage(event?.image.fileName);
    const result = await deleteEventById(id);
    if (result) {
      logger.info("Succes delete event");
      return res.status(200).send({
        statusCode: 200,
        type: true,
        message: "success delete event",
      });
    } else {
      logger.info("Event Not Found");

      return res.status(400).send({
        statusCode: 400,
        type: false,
        message: "Event Not Found",
      });
    }
  } catch (error) {
    logger.info("Failed delete event");
    logger.error(`Error: ${error}`);
    return res.status(400).send({
      statusCode: 400,
      type: false,
      message: error,
    });
  }
};
