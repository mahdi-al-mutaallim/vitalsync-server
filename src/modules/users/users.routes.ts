import validateRequest from "@/middlewares/validateRequest.js";
import { createRouter } from "@/shared/createRouter.js";
import { UserControllers } from "./users.controllers.js";
import { UsersValidations } from "./users.validations.js";

const router = createRouter();

router.post("/", validateRequest(UsersValidations.createAdminRequestBodyValidation), UserControllers.createAdmin);

export const UserRoutes = router;
