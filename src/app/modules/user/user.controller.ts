import type { RequestHandler } from "express";
import { userService } from "./user.service.js";

const createAdmin: RequestHandler = async (req, res) => {
  const result = await userService.createAdmin(req.body)
  res.send((result))
}

export const userController = {
  createAdmin
}
