import validate_request from "@/middlewares/validate-request.js";
import { createRouter } from "@/shared/createRouter.js";
import { AdminControllers } from "./admin.controller.js";
import { admin_validation_schemas } from "./admin.validations.js";

const router = createRouter();

router.get("/", AdminControllers.getAdmins);
router.get("/:id", AdminControllers.getAdminById);
router.patch(
	"/:id",
	validate_request(admin_validation_schemas.admin_update),
	AdminControllers.updateAdminIntoDB,
);
router.delete("/:id", AdminControllers.deleteAdminFromDB);
router.patch("/:id/delete", AdminControllers.softDeleteAdminFromDB);

export const AdminRoutes = router;
