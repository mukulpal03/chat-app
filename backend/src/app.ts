import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", function (ws) {
  console.log("user connected");

  ws.send("first connect");

  ws.on("message", (e) => {
    wss.clients.forEach((client) => {
      client.send(e.toString());
    });
  });
});
