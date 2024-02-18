import WebSocket from "ws";

const connectionWebSocket = (url, onMessage, onOpen, onError, onClose) => {
  const socket = new WebSocket(url);

  socket.onmessage = onMessage;
  socket.onopen = onOpen;
  socket.onerror = onError;
  socket.onclose = onClose;

  return socket;
};

export default connectionWebSocket;
