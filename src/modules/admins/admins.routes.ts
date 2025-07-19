import { UserRole } from "generated/prisma/index.js";
import authValidator from "@/middlewares/authValidator.js";
import validateRequest from "@/middlewares/validateRequest.js";
import { createRouter } from "@/shared/createRouter.js";
import { AdminValidations } from "./admin.validations.js";
import { AdminControllers } from "./admins.controllers.js";

const router = createRouter();

router.get("/", authValidator(UserRole.SUPERADMIN), AdminControllers.getAdmins);
router.get("/:id", authValidator(UserRole.SUPERADMIN), AdminControllers.getAdminById);
router.patch(
	"/:id",
	authValidator(UserRole.SUPERADMIN),
	validateRequest(AdminValidations.updateRequestBodyValidation),
	AdminControllers.updateAdminById,
);
router.delete("/:id", authValidator(UserRole.SUPERADMIN), AdminControllers.deleteAdminById);
router.patch("/:id/delete", authValidator(UserRole.SUPERADMIN), AdminControllers.softDeleteAdminById);

export const AdminRoutes = router;
