import express from "express";
import { userController } from "./user.controller.js";

const router = express.Router();

router.post("/", userController.createAdmin);

export const userRoutes = router;
