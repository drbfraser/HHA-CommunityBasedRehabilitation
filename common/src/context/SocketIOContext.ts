import React from "react";
import io from "socket.io-client";

const appEnv = process.env.NODE_ENV;

let url: string;
if (appEnv === "production") {
    url = "https://cbrp.cradleplatform.com";
} else if (appEnv === "test") { // staging
    url = "https://cbrs.cradleplatform.com";
} else {
    url = `http://${window.location.hostname}:8000`
}

export const socket = io(`${url}`, {
  transports: ["websocket"],
  autoConnect: true,
});

socket.on("connect", () => {
console.log(`[SocketIO] Web user connected on ${url}. SocketID: ${socket.id}`);
});

socket.on("disconnect", () => {
console.log(`[SocketIO] Web user disconnected`);
});

export const SocketContext = React.createContext(socket);
