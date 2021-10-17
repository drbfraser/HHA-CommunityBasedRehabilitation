const socket = io("http://localhost:8000");

socket.on("alert", (msg) => {
  console.log("Status Resource: main.js received the alert", msg);
  console.log("Status Resource: socket - ", socket);
});
