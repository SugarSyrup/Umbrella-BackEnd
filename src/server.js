import express from 'express';
import http from "http";
import WebSocket, {WebSocketServer} from "ws";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

//WebSocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const sockets = [];

wss.on("connection", (socket) => {  
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
          case "new_message":
            sockets.forEach((aSocket) =>
              aSocket.send(`${socket.nickname}: ${message.payload}`)
            );
          case "nickname":
            socket["nickname"] = message.payload;
        }
    });
});

const handleListen = () => {
    console.log(`http://localhost:3000 is now running`);
    console.log(`ws://localhost:3000 is now running`);
}
server.listen(process.env.PORT || 8080, handleListen);


