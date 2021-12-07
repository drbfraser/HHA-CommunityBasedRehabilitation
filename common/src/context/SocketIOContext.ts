import React from "react";
import io from "socket.io-client";
import { commonConfiguration } from "../init";

let url = commonConfiguration?.socketIOUrl
    ? commonConfiguration.socketIOUrl
    : "http://localhost:8000";

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
