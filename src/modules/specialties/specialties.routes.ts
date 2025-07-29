import { createRouter } from "@/shared/createRouter.js";
import { SpecialtiesControllers } from "./specialties.controllers.js";

const router = createRouter();

router.post("/", SpecialtiesControllers.createSpecialty);
router.get("/", SpecialtiesControllers.getSpecialties);
router.get("/:id", SpecialtiesControllers.getSpecialtyById);
router.patch("/:id", SpecialtiesControllers.updateSpecialtyById);
router.delete("/:id", SpecialtiesControllers.deleteSpecialtyById);

export const SpecialtiesRoutes = router;
