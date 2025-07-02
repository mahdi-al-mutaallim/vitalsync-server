import validate_request from "@app/middlewares/validate-request";
import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import { admin_validation_schemas } from "./admin.validations";

const router = Router();

router.get("/", AdminControllers.getAdmins);
router.get("/:id", AdminControllers.getAdminById);
router.patch(
	"/:id",
	validate_request(admin_validation_schemas.admin_update),
	AdminControllers.updateAdminIntoDB,
);
router.delete("/:id", AdminControllers.deleteAdminFromDB);
router.patch("/:id/delete", AdminControllers.softDeleteAdminFromDB);

export const admin_routes = router;
