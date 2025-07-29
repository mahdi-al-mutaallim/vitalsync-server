import { UserRole } from "generated/prisma/index.js";
import accessValidator from "@/middlewares/accessValidator.js";
import tokenValidator from "@/middlewares/tokenValidator.js";
import validateRequest from "@/middlewares/validateRequest.js";
import { createRouter } from "@/shared/createRouter.js";
import { AdminValidations } from "./admin.validators.js";
import { AdminControllers } from "./admins.controllers.js";

const router = createRouter();

router.get("/", tokenValidator(), accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN), AdminControllers.getAdmins);
router.get(
	"/:id",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN),
	validateRequest(AdminValidations.UserIdParamsRequestValidationSchema),
	AdminControllers.getAdminById,
);
router.patch(
	"/:id",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN),
	validateRequest(AdminValidations.updateAdminByIdRequestValidationSchema),
	AdminControllers.updateAdminById,
);
router.delete(
	"/:id",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN),
	validateRequest(AdminValidations.UserIdParamsRequestValidationSchema),
	AdminControllers.deleteAdminById,
);
router.patch(
	"/:id/delete",
	tokenValidator(),
	accessValidator(UserRole.SUPERADMIN, UserRole.ADMIN),
	validateRequest(AdminValidations.UserIdParamsRequestValidationSchema),
	AdminControllers.softDeleteAdminById,
);

export const AdminRoutes = router;
