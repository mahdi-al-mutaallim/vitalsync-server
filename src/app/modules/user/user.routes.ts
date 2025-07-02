import { Router } from "express";
import { userController } from "./user.controller.js";

const router = Router();

router.post("/", userController.createAdmin);

export const user_routes = router;
