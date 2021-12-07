import React from "react";
import io from "socket.io-client";

const BASE_URLS: any = {
  local: process.env.LOCAL_URL ?? "",
  dev: "https://cbrd.cradleplatform.com",
  staging: "https://cbrs.cradleplatform.com",
  prod: "https://cbr.hopehealthaction.org",
};

const DEFAULT_APP_ENV = "dev";
let appEnv = process.env.APP_ENV ?? DEFAULT_APP_ENV;

if (appEnv === "local" && !BASE_URLS.local) {
  appEnv = DEFAULT_APP_ENV;
}

let url: string;
switch(appEnv) {
  case "production":
    url = BASE_URLS['prod'];
    break;

  case "test": // staging
    url = BASE_URLS['staging'];
    break;

  case "dev":
    url = BASE_URLS['dev'];
    break;

  default:
    url = "http://localhost:8000";
    break;
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
