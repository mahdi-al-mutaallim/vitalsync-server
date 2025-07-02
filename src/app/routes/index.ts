import { adminRoutes } from "@app/modules/admin/admin.routes";
import { userRoutes } from "@app/modules/user/user.routes";
import { Router } from "express";

const router = Router();

type TRoute = { path: string; router: Router };

const module_routes: TRoute[] = [
  { path: '/users', router: userRoutes },
  { path: "/admins", router: adminRoutes }
]

module_routes.forEach(route => router.use(route.path, route.router));

export default router;
