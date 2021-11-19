import React from "react";
import io from "socket.io-client";
import { API_BASE_URL } from "../util/api";

export const socket = io(`${API_BASE_URL}`, {
    transports: ["websocket"],
    autoConnect: true,
});

socket.on("connect", () => {
    console.log(`[SocketIO] Web user connected on ${API_BASE_URL}. SocketID: ${socket.id}`);
});

socket.on("disconnect", () => {
    console.log(`[SocketIO] Web user disconnected`);
});

export const SocketContext = React.createContext(socket);
