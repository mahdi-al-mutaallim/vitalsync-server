import { AdminRoutes } from "@/modules/admins/admins.routes.js";
import { AuthRoutes } from "@/modules/auth/auth.routes.js";
import { UserRoutes } from "@/modules/users/users.routes.js";
import { createRouter, type TRouter } from "@/shared/createRouter.js";

const router = createRouter();

type TRoute = { path: string; router: TRouter };

const moduleRoutes: TRoute[] = [
	{ path: "/auth", router: AuthRoutes },
	{ path: "/users", router: UserRoutes },
	{ path: "/admins", router: AdminRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
