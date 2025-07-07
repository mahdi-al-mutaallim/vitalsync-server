import { createRouter } from "@/shared/createRouter.js";
import { AuthControllers } from "./auth.controllers.js";

const router = createRouter();

router.post("/login", AuthControllers.LoginUser);
router.post("/refresh", AuthControllers.TokenRefresher);

export const AuthRoutes = router;
