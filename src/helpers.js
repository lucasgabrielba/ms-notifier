require("dotenv").config();
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

export const venomConfig = {
  browserPathExecutable: "",
  folderNameToken: "tokens",
  mkdirFolderToken: false,
  headless: "new",
  devtools: false,
  debug: false,
  logQR: true,
  browserWS: "",
  browserArgs: [""],
  addBrowserArgs: ["--user-agent"],
  puppeteerOptions: {},
  disableSpins: true,
  disableWelcome: true,
  updatesLog: true,
  autoClose: 60000,
  createPathFileToken: false,
  addProxy: [""],
  userProxy: "",
  userPass: "",
};

export function formatWhatsappNumber(phone) {
  const cleanedNumber = phone.replace(/\D/g, "");
  const formattedNumber = `55${cleanedNumber}`;
  return formattedNumber;
}

export const rabbitMQUrl = process.env.RABBIT_MR_URL;
export const queueName = process.env.QUEUE_NAME;

export function deleteTokensFile() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const tokensPath = path.join(__dirname, "tokens");

  if (fs.existsSync(tokensPath)) {
    fs.rmdirSync(tokensPath, { recursive: true });
  }
}
