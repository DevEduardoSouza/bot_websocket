import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";

function inicializarTelegramBot(token) {
  return new TelegramBot(token, { polling: true });
}

function enviarMensagem(bot, chat_id, mensagem) {
  bot.sendMessage(chat_id, mensagem);
}

export { inicializarTelegramBot, enviarMensagem };
