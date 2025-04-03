import { io, Socket } from "socket.io-client";
import { getUserId } from "./secureStore";

const SOCKET_SERVER_URL = process.env.EXPO_PUBLIC_SOCKET_URL; // Your backend WebSocket URL

// Module-level variable to hold the socket instance
// let socket: Socket | null = null;

export const connectSocket = async () => {
  const userId = await getUserId("user_id"); // Retrieve user ID from secure store

  if (!userId) {
    console.error("User ID not found, cannot connect to WebSocket");
    return null;
  }

  const socket = io(SOCKET_SERVER_URL, {
    withCredentials: true,
    transports: ["websocket"],
    query: { userId }, // Pass user ID in the connection request
  });

  socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from WebSocket server");
  });

  return socket;
};

// export const disconnectSocket = (): void => {
//   if (socket) {
//     socket.disconnect();
//     console.log("✅ Socket disconnected");
//     socket = null;
//   }
// };
