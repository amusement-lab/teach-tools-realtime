import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import TestController from "./controller";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.get("/status/:roomId", TestController.statusRoom);
app.get("/join-room/:roomId", TestController.joinRoom);
app.post("/create-room", TestController.createRoom);
app.post("/add-info/:roomId", TestController.addInfo);
app.post(
  "/change-understand-status/:roomId/:clientId/:understandStatus",
  TestController.changeUnderstandStatus
);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`);
});
