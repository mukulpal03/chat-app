import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", function (ws) {
  console.log("user connected");

  ws.on("message", function (message) {
    wss.clients.forEach((client) => client.send(message.toString()));
  });
});
