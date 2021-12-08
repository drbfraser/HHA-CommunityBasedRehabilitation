import React from "react";
import io from "socket.io-client";
import { commonConfiguration } from "../init";

let url: string;

if (commonConfiguration?.socketIOUrl) {
    url = commonConfiguration.socketIOUrl;
} else {
    switch (process.env.NODE_ENV) {
        case "development":
            url = window.location.hostname
                ? `http://${window.location.hostname}:8000`
                : "http://localhost:8000";
            break;
        case "production":
            url = "https://cbr.hopehealthaction.org";
            break;
        case "test":
            url = "https://cbrs.cradleplatform.com";
            break;
        default:
            url = "https://cbrd.cradleplatform.com";
            break;
    }
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
