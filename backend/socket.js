import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        "https://blinkit-clone-frontend-one.vercel.app",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

     socket.on("joinOrder", (orderId) => {
    socket.join(orderId);
  });

  // Leave order room
  socket.on("leaveOrder", (orderId) => {
    socket.leave(orderId);
  });

  // Broadcast location updates
  socket.on("locationUpdate", (data) => {
    const { orderId, lat, lng } = data;
    io.to(orderId).emit("locationUpdate", { lat, lng });
  });

    socket.on("sendLocation", ({ orderId, lat, lng }) => {
      if (!orderId || lat == null || lng == null) return;
      io.to(orderId).emit("locationUpdate", { lat, lng });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

// Safe getter
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
