import "./paths";
import router from "@app/routes";
import cors from "cors";
import express, { type Application } from "express";
import type { Server } from "http";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

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
