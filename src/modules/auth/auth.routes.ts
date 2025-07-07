import { createRouter } from "@/shared/createRouter.js";
import { auth_controllers } from "./auth.controller.js";

const router = createRouter();

router.post("/login", auth_controllers.login_user);
router.post("/refresh", auth_controllers.token_refresher);

export const AuthRoutes = router;
