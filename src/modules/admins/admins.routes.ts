import validateRequest from "@/middlewares/validateRequest.js";
import { createRouter } from "@/shared/createRouter.js";
import { AdminValidations } from "./admin.validations.js";
import { AdminControllers } from "./admins.controllers.js";

const router = createRouter();

router.get("/", AdminControllers.getAdmins);
router.get("/:id", AdminControllers.getAdminById);
router.patch("/:id", validateRequest(AdminValidations.updateRequestBodyValidation), AdminControllers.updateAdminById);
router.delete("/:id", AdminControllers.deleteAdminById);
router.patch("/:id/delete", AdminControllers.softDeleteAdminById);

export const AdminRoutes = router;
