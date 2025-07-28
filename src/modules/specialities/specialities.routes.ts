import { createRouter } from "@/shared/createRouter.js";
import { SpecialitiesControllers } from "./specialities.controllers.js";

const router = createRouter();

router.post("/", SpecialitiesControllers.createSpecialitie);
router.get("/", SpecialitiesControllers.getSpecialities);
router.get("/:id", SpecialitiesControllers.getSpecialitieById);
router.patch("/:id", SpecialitiesControllers.updateSpecialitieById);
router.delete("/:id", SpecialitiesControllers.deleteSpecialitieById);

export const SpecialitiesRoutes = router;
