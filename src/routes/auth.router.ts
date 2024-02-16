import { Router } from "express";
import {
  RegisterUser,
  getUser,
  loginUser,
  refreshSession,
} from "../controllers/auth.controller";
import { requireAdmin } from "../middleware/auth";

export const AuthRouter: Router = Router();

AuthRouter.get("/", requireAdmin, getUser);
AuthRouter.post("/register", RegisterUser);
AuthRouter.post("/login", loginUser);
AuthRouter.post("/refresh", refreshSession);
