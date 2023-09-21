import { formatWhatsappNumber, deleteTokensFile } from "./helpers.js";
import {
  connectToWhatsApp,
  disconnectWhatsApp,
  sendToQueue,
  getStatusWhatsApp,
} from "./model.js";

export async function handleQRCode(req, res) {
  try {
    deleteTokensFile();

    const qrCode = await connectToWhatsApp();

    res.status(200).send(qrCode);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao gerar QR code");
  }
}

export async function handleStatus(req, res) {
  try {
    const status = await getStatusWhatsApp();
    res.status(200).send(status);
  } catch (error) {
    res.status(500).send("Erro ao verificar o status");
  }
}

export async function handleDisconnect(req, res) {
  try {
    const isDisconnect = await disconnectWhatsApp();
    res.status(200).send(isDisconnect);
  } catch (error) {
    res.status(500).send("Erro ao desconectar WhatsApp");
  }
}

export async function handleSendToQueue(req, res) {
  const { message, phone, type } = req.body;

  const notification = JSON.stringify({
    phone: formatWhatsappNumber(phone),
    message,
    type,
  });

  try {
    await sendToQueue(notification);
    res.json(true);
  } catch (error) {
    console.error("Erro ao lidar com o envio para a fila:", error);
    res.status(500).send("Erro ao lidar com o envio para a fila.");
  }
}
