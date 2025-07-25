import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
});

// Connection event handlers
socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from server:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export default socket;