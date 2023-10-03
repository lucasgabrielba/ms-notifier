import * as venom from "venom-bot";
import {
  venomConfig,
  queueName,
  rabbitMQUrl,
  deleteTokensFile,
} from "./helpers.js";
import * as amqp from "amqplib";

export const clients = {};
export const isWhatsAppConnected = {};

export async function createWhatsAppInstance(sessionId) {
  deleteTokensFile(sessionId);

  return new Promise((resolve, reject) => {
    venom
      .create(
        { session: sessionId },
        (base64Qrimg) => {
          resolve(base64Qrimg);
        },
        (statusSession, session) => {
          console.log("Status Session: ", statusSession);
          console.log("Session name: ", session);
        },
        {
          venomConfig,
        },
        (browser, waPage) => {
          console.log("Browser PID:", browser.process().pid);
          waPage.screenshot({ path: `${sessionId}_screenshot.png` });
        }
      )
      .then(async (venomClient) => {
        clients[sessionId] = venomClient;
        isWhatsAppConnected[sessionId] = true;

        setInterval(() => {
          if (isWhatsAppConnected[sessionId]) {
            consumeQueueAndSendWhatsapp(sessionId);
          }
        }, 60 * 1000);
      })
      .catch((error) => {
        console.log(error);
        reject("Erro ao estabelecer conexão");
      });
  });
}

export async function disconnectWhatsApp(sessionId) {
  const client = clients[sessionId];
  if (client) {
    client
      .close()
      .then(() => {
        isWhatsAppConnected[sessionId] = false;
        delete clients[sessionId];
      })
      .catch((error) => {
        console.error("Erro ao desconectar WhatsApp:", error);
      });
  }
}

export async function getStatusWhatsApp(sessionId) {
  return isWhatsAppConnected[sessionId] || false;
}

export async function consumeQueueAndSendWhatsapp(sessionId) {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    channel.assertQueue(sessionId, { durable: true, autoDelete: true });
    channel.consume(sessionId, async (msg) => {
      const { message, phone, type } = JSON.parse(
        JSON.parse(msg.content.toString())
      );

      const to = `${phone}@c.us`;

      if (
        type === "ficha-de-abertura" ||
        type === "ficha-de-encerramento" ||
        type === "ficha-de-encerramento-com-garantia"
      ) {
        await clients[sessionId]
          .sendFileFromBase64(to, message, `${type}.pdf`, "")
          .then((result) => {
            console.log(result);
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro);
          });
      }

      if (type === "text") {
        await clients[sessionId]
          .sendText(to, message)
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.error("Erro ao enviar mensagem:", error);
          });
      }

      console.log("Mensagem enviada pelo WhatsApp:", message);
      channel.ack(msg);
    });
  } catch (error) {
    console.error("Erro ao consumir a fila e enviar pelo WhatsApp:", error);
  }
}

export async function sendToQueue(notification, queueName) {
  try {
    console.log(queueName);
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: true,
    });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(notification)));

    console.log("Mensagem enviada para a fila:", notification);
    return;
  } catch (error) {
    console.error("Erro ao enviar para a fila:", error.message);
    return error;
  }
}
