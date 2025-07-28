import { createRouter } from "@/shared/createRouter.js";
import { DoctorsControllers } from "./doctors.controllers.js";

const router = createRouter();

router.post("/", DoctorsControllers.createDoctor);
router.get("/", DoctorsControllers.getDoctors);
router.get("/:id", DoctorsControllers.getDoctorById);
router.patch("/:id", DoctorsControllers.updateDoctorById);
router.delete("/:id", DoctorsControllers.deleteDoctorById);

export const DoctorsRoutes = router;
