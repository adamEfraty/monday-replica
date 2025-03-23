import { io } from "socket.io-client";
import { loadBoards } from "../store/actions/boards.actions.js";
import { loadUsers } from "../store/actions/user.actions.js";

const SOCKET_URL = "http://localhost:3000"; // Replace with your backend URL if different

export const socket = io(SOCKET_URL, {
  withCredentials: true, // Ensures cookies are sent if needed
});

console.log("Connecting to Socket.IO server...", socket.id);

// Optional: Add event listeners for debugging
socket.on("connect", () => {
  console.log("Connected to Socket.IO server:", socket.id);
});

socket.on("api response", (response) => {
  console.error("API response received:", response);
  loadBoardsAndUsers();
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});

export function loadBoardsAndUsers() {
  loadBoards();
  loadUsers();
}
