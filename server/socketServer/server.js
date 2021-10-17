const http = require("http");
// const express = require("express");
const server = http.createServer();
const socketio = require("socket.io");
const PORT = 8000

const io = socketio(server, {
  cors: {
    origin: `http://localhost:${PORT}/`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("coonnected yo; socket ID: ", socket.id);
  io.emit("alert", "hello world");
  socket.broadcast.emit('new user', "new user connected")
});

server.listen(PORT, () => 
  console.log(`Socket Server Listening on port ${PORT}`)
)


