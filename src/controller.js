import { formatWhatsappNumber, deleteTokensFile } from "./helpers.js";
import * as model from "./model.js";

export async function handleQRCode(req, res) {
  try {
    const { intanceId } = req.params;
    const qrCode = await model.createWhatsAppInstance(intanceId);
    res.status(200).send(qrCode);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao gerar QR code");
  }
}

export async function handleStatus(req, res) {
  try {
    const { intanceId } = req.params;
    const status = await model.getStatusWhatsApp(intanceId);
    res.status(200).send(status);
  } catch (error) {
    res.status(500).send("Erro ao verificar o status");
  }
}

export async function handleDisconnect(req, res) {
  try {
    const { intanceId } = req.params;
    const isDisconnect = await model.disconnectWhatsApp(intanceId);
    res.status(200).send(isDisconnect);
  } catch (error) {
    res.status(500).send("Erro ao desconectar WhatsApp");
  }
}

export async function handleSendToQueue(req, res) {
  const { intanceId, message, phone, type } = req.body;

  const notification = JSON.stringify({
    phone: formatWhatsappNumber(phone),
    message,
    type,
  });

  try {
    await model.sendToQueue(notification, intanceId);
    res.json(true);
  } catch (error) {
    console.error("Erro ao lidar com o envio para a fila:", error);
    res.status(500).send("Erro ao lidar com o envio para a fila.");
  }
}
