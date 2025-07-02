import express from "express";
import { AdminControllers } from "./admin.controller";

const router = express.Router();

router.get("/", AdminControllers.getAdmins);
router.get("/:id", AdminControllers.getAdminById);
router.patch("/:id", AdminControllers.updateAdminIntoDB);
router.delete("/:id", AdminControllers.deleteAdminFromDB);
router.patch("/:id/delete", AdminControllers.softDeleteAdminFromDB);

export const adminRoutes = router;
