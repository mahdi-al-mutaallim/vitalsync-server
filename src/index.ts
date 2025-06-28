import express, { type Application } from 'express';
import cors from "cors";
import type { Server } from 'http';

const app: Application = express();

app.use(cors())

const port = 3000;

let server: Server

(async () => {
  server = app.listen(port, () => {
    console.log(`App is listening on port `, port)
  })
})()
