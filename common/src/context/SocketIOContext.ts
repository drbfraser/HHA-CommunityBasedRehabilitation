import { DefaultEventsMap } from "@socket.io/component-emitter";
import React from "react";
import io, { Socket } from "socket.io-client";

export let SocketContext: React.Context<any>;
export let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const initSocketContext = (socketIOUrl: string) => {
    socket = io(`${socketIOUrl}`, {
        transports: ["websocket"],
        autoConnect: true,
    });

    socket.on("connect", () => {
        console.log(`[SocketIO] Web user connected on ${socketIOUrl}. SocketID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
        console.log(`[SocketIO] Web user disconnected`);
    });

    SocketContext = React.createContext(socket);
};
