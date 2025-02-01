import express, { Express } from "express";
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

app.get("/listen-admin/:roomId/:adminId", TestController.statusAdminRoom);
app.get("/listen-client/:roomId/:clientId", TestController.statusClientRoom);
app.get("/join-client-room/:roomId/:name", TestController.joinClientRoom);
app.post("/create-room", TestController.createRoom);
app.post("/add-info/:roomId", TestController.addInfo);
app.post(
  "/change-understand-status/:roomId/:clientId/:understandStatus",
  TestController.changeUnderstandStatus
);
app.post(
  "/reset-understand-status/:roomId",
  TestController.resetAllUnderstandStatus
);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
