const express = require("express");
const router = express.Router();
const http = require("http").Server(express);
const { Server } = require("socket.io")(http);
const { analyzeAudioStream } = require("../services/modelService");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("audio", async (data) => {
    const notesData = await analyzeAudioStream(data);
    socket.emit("score-data", notesData);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
