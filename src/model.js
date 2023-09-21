import * as venom from "venom-bot";
import { venomConfig, queueName, rabbitMQUrl } from "./helpers.js";
import * as amqp from "amqplib";

export let client;
export let isWhatsAppConnected = false;

export async function connectToWhatsApp() {
  return new Promise((resolve, reject) => {
    venom
      .create(
        { session: "user" },
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
          waPage.screenshot({ path: "screenshot.png" });
        }
      )
      .then(async (venomClient) => {
        client = venomClient;
        isWhatsAppConnected = true;

        setInterval(() => {
          consumeQueueAndSendWhatsapp();
        }, 10000);
      })
      .catch((error) => {
        console.log(error);
        reject("Erro ao estabelecer conexão");
      });
  });
}

export async function disconnectWhatsApp() {
  if (client) {
    client
      .close()
      .then(() => {
        isWhatsAppConnected = false;
        res.send(true);
      })
      .catch((error) => {
        console.error("Erro ao desconectar WhatsApp:", error);
        res.status(500).send(false);
      });
  } else {
    res.status(404).send("WhatsApp não estava conectado.");
  }
}

export async function getStatusWhatsApp() {
  return isWhatsAppConnected;
}

async function consumeQueueAndSendWhatsapp() {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    channel.assertQueue(queueName, { durable: true, autoDelete: true });
    channel.consume(queueName, async (msg) => {
      const { message, phone, type } = JSON.parse(
        JSON.parse(msg.content.toString())
      );

      const to = `${phone}@c.us`;

      if (
        type === "ficha-de-abertura" ||
        type === "ficha-de-encerramento" ||
        type === "ficha-de-encerramento-com-garantia"
      ) {
        await client
          .sendFileFromBase64(to, message, `${type}.pdf`, "")
          .then((result) => {
            console.log(result);
            return true;
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro);
            return false;
          });
      }

      if (type === "text") {
        await client
          .sendText(to, message)
          .then((result) => {
            console.log(result);
            return true;
          })
          .catch((error) => {
            console.error("Erro ao enviar mensagem:", error);
            return false;
          });
      }

      console.log("Mensagem enviada pelo WhatsApp:", message);
      channel.ack(msg);
    });
  } catch (error) {
    console.error("Erro ao consumir a fila e enviar pelo WhatsApp:", error);
  }
}
