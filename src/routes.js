import { config } from "dotenv";
import express from "express";
import * as controller from "./controller.js";

config();
export const app = express();
export const port = process.env.APP_PORT || 8922;

app.use(express.json());

app.get("/qrcode/:intanceId", controller.handleQRCode);

app.get("/disconnect/:intanceId", controller.handleDisconnect);

app.get("/status/:intanceId", controller.handleStatus);

app.post("/send-to-queue", controller.handleSendToQueue);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
