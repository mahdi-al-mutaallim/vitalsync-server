import type { Server } from "node:http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import global_error_handler from "@/middlewares/global-error-handler.js";
import not_found from "@/middlewares/not-found.js";
import router from "@/routes/index.js";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);
app.use(global_error_handler);
app.use(not_found);

const port = 3000;

export let server: Server;

app.get("/", (_req: express.Request, res: express.Response) => {
	res.send({ message: "VitalSync API is running!" });
});

(async () => {
	server = app.listen(port, () => {
		console.log(`App is listening on port `, port);
	});
})();
