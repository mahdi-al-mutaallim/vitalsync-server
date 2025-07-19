import type { Server } from "node:http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import globalErrorHandler from "@/middlewares/globalErrorHandler.js";
import notFound from "@/middlewares/notFound.js";
import router from "@/routes/index.js";
import { config } from "./config/index.js";
import seedSuperAdmin from "./db/index.js";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);

export let server: Server;

app.get("/", (_req: express.Request, res: express.Response) => {
	res.send({ message: "VitalSync API is running!" });
});

(async () => {
	server = app.listen(config.port, async () => {
		console.log("App is listening on port", config.port);
		await seedSuperAdmin();
	});
})();
