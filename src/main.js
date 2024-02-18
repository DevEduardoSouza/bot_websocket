import "dotenv/config";

import connectionWebSocket from "./connection/websocket.js";
import {
  inicializarTelegramBot,
  enviarMensagem,
} from "./telegram/telegramBot.js";

import { handlingMessages } from "./handlingMessages.js";

const token = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = inicializarTelegramBot(token, true);

const urlWebSocket = process.env.WEBSOCKET_URL;

connectionWebSocket(
  urlWebSocket,
  function onMessage(event) {
    const resposta = handlingMessages(event.data);
    if (resposta) {
      enviarMensagem(bot, CHAT_ID, resposta);
    }
  },
  function onOpen(event) {
    console.log("Conexão aberta");
  },
  function onError(error) {
    console.error("Erro:", error);
  },
  function onClose(event) {
    console.log("Conexão fechada");
  }
);
