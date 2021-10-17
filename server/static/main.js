console.log("Helloo world from main js").encode()

const socket = io('http://localhost:8000')

socket.on('alert', (msg) => {
  console.log("main.js received the alert", msg)
})