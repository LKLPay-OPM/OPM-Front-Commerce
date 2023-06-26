import { io } from "socket.io-client";
/* environment */
import { PUBLIC_TICKETS_WS } from "$env/static/public";

export const appTicketsSocket = io(PUBLIC_TICKETS_WS, { autoConnect: true });

appTicketsSocket.on("connect", () => {
  console.log("Listening Tickets Socket");
});
