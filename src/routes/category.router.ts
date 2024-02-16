import { Router } from "express";
import {
  createCategory,
  getCategory,
} from "../controllers/category.controller";
import { requireAdmin } from "../middleware/auth";

export const CategoryRouter: Router = Router();

CategoryRouter.get("/", getCategory);
CategoryRouter.post("/", requireAdmin, createCategory);
