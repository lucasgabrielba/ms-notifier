require("dotenv").config();
import express from "express";
import * as whatsappController from "./controller.js";

export const app = express();
export const port = process.env.APP_PORT || 3400;

app.use(express.json());

app.get("/qrcode", whatsappController.handleQRCode);

app.get("/disconnect", whatsappController.handleDisconnect);

app.get("/status", whatsappController.handleStatus);

app.post("/send-to-queue", whatsappController.handleSendToQueue);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
