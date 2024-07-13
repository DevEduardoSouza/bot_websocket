import "dotenv/config";
import { delay } from "./utils/utils.js";
import connectionWebSocket from "./connection/websocket.js";
import { handlingMessages } from "./handlingMessages.js";
import TelegramBot from "node-telegram-bot-api";
import app from "./server.js";

const token = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });
let websocketConnection = null;

app.post("/receive-uri", async (req, res) => {
  const uri = req.body.uri;
  console.log(req);

  console.log("Received URI:", uri);

  if (websocketConnection) {
    websocketConnection.close();
  }

  await delay(10000);

  init(CHAT_ID, uri);

  bot.sendMessage(CHAT_ID, "O bot foi inicializado Futbol Studio na Betano!");
  res.sendStatus(200);
});

function init(chatId, uri) {
  connectionWebSocket(
    uri,
    function onMessage(event) {
      const resposta = handlingMessages(event.data);
      if (resposta) {
        bot.sendMessage(chatId, resposta);
      }
    },
    function onOpen(event) {
      console.log("Conexão aberta");
      websocketConnection = event.target;
    },
    function onError(error) {
      console.error("Erro:", error);
    },
    function onClose(event) {
      console.log("Conexão fechada");
      websocketConnection = null;
    }
  );
}
