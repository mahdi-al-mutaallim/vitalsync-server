import { createRouter } from "@/shared/createRouter.js";
import { PatientsControllers } from "./patients.controllers.js";

const router = createRouter();

router.post("/", PatientsControllers.createPatient);
router.get("/", PatientsControllers.getPatients);
router.get("/:id", PatientsControllers.getPatientById);
router.patch("/:id", PatientsControllers.updatePatientById);
router.delete("/:id", PatientsControllers.deletePatientById);

export const PatientsRoutes = router;
