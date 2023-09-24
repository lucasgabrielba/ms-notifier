import { config } from "dotenv";
import { exec } from "child_process";
config();

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

export function deleteTokensFile(folderName) {
  const command = `rm -r tokens/${folderName}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao excluir a pasta '${folderName}':`, error);
      return;
    }
    console.log(`Pasta '${folderName}' excluída com sucesso.`);
  });
}
