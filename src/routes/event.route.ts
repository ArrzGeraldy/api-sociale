import { Router } from "express";
import {
  createEvent,
  updateEvent,
  getEvent,
  deleteEvent,
} from "../controllers/event.controller";
import { requireUser } from "../middleware/auth";
import { upload } from "../middleware/multer";

export const EventRouter: Router = Router();

EventRouter.get("/", getEvent);
EventRouter.get("/:id", getEvent);
EventRouter.post("/", upload, requireUser, createEvent);
EventRouter.put("/:id", requireUser, updateEvent);
EventRouter.delete("/:id", requireUser, deleteEvent);
