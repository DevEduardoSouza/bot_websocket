### Documentação para Capturar e Enviar URIs de WebSocket Usando Tampermonkey e um Servidor Express

- A ideia deste projeto é realizar scraping via WebSocket. Como a URI da conexão frequentemente expira por inatividade, desenvolvi este sistema para capturar a URI a cada 5 minutos, garantindo que ela esteja sempre atualizada e evitando problemas de inatividade.

- O alvo nesse código é o Futebol Studio na Betano

#### Cliente: UserScript com Tampermonkey

1. **Instalar Tampermonkey**

   - Certifique-se de ter o Tampermonkey instalado no seu navegador. É uma extensão disponível para diversos navegadores como Chrome, Firefox, Edge, etc.

2. **Criar um Novo UserScript**

   - Abra o painel do Tampermonkey e crie um novo UserScript.
   - Cole o seguinte código:

   ```javascript
   // ==UserScript==
   // @name         WebSocket URI Logger with Filter and Send
   // @namespace    http://tampermonkey.net/
   // @version      2024-07-04
   // @description  Log and send WebSocket URIs containing EVOSESSIONID for Betano URLs
   // @author       You
   // @match        *://*/*
   // @grant        none
   // @connect      localhost
   // ==/UserScript==

   (function () {
     "use strict";

     console.log("Script started for Betano URLs");

     // Função para recarregar a página a cada 5 minutos
     setTimeout(() => {
       location.reload();
     }, 300000); // 300000 milissegundos = 5 minutos

     // Interceptar o construtor WebSocket
     const originalWebSocket = window.WebSocket;
     window.WebSocket = function (url, protocols) {
       console.log("WebSocket connection to:", url);
       if (url.includes("EVOSESSIONID") && !url.includes("chat")) {
         sendURIToServer(url);
       }
       return protocols
         ? new originalWebSocket(url, protocols)
         : new originalWebSocket(url);
     };

     // Garantir que a cadeia de protótipos esteja correta
     window.WebSocket.prototype = originalWebSocket.prototype;

     // Função para enviar URI para o servidor
     function sendURIToServer(uri) {
       fetch("http://localhost:3000/receive-uri", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ uri: uri }),
       })
         .then((response) => {
           if (!response.ok) {
             throw new Error("Network response was not ok");
           }
           console.log("URI sent successfully");
         })
         .catch((error) => {
           console.error("Failed to send URI:", error);
         });
     }
   })();
   ```

#### Servidor: Aplicação Express

1. **Instalar Dependências**

   - Instale as dependências necessárias:

   ```sh
   npm install express body-parser cors dotenv node-telegram-bot-api
   ```

2. **Criar o Servidor Express**

   - Crie um arquivo `server.js` com o seguinte código:

   ```javascript
   import "dotenv/config";
   import express from "express";
   import bodyParser from "body-parser";
   import cors from "cors";

   const app = express();
   const port = process.env.PORT || 3000;

   app.use(bodyParser.json());
   app.use(cors());

   app.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);
   });

   export default app;
   ```

3. **Manipular URIs Recebidas**

   - No arquivo principal do servidor (por exemplo, `main.js`), adicione o seguinte código:

   ```javascript
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
     console.log("Received URI:", uri);

     if (websocketConnection) {
       websocketConnection.close();
     }

     await delay(10000);

     init(CHAT_ID, uri);

     bot.sendMessage(
       CHAT_ID,
       "O bot foi inicializado Futbol Studio na Betano!"
     );
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
   ```

#### Estrutura do Projeto

- **Cliente (UserScript com Tampermonkey)**

  - Arquivo: `WebSocket URI Logger with Filter and Send.user.js`

- **Servidor (Express)**
  - Arquivo: `server.js`
  - Arquivo: `main.js`
  - Outras dependências e arquivos como `utils.js`, `websocket.js`, `handlingMessages.js`, e `.env`

#### `.env` (Variáveis de Ambiente)

```plaintext
PORT=3000
TELEGRAM_TOKEN=seu_telegram_bot_token
TELEGRAM_CHAT_ID=seu_chat_id
```

### Conclusão

Com este setup, você pode capturar URIs de WebSocket no navegador usando Tampermonkey e enviar essas URIs para um servidor Express, que pode manipulá-las conforme necessário.
