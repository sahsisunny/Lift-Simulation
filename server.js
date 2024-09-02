const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("src"));

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("createRoom", (roomId) => {
    rooms.set(roomId, {
      users: new Set(),
      liftState: {
        lifts: {},
        floor: 0,
        liftCount: 0,
      },
    });
    socket.join(roomId);
    socket.emit("roomCreated", roomId);
    console.log(`Room created: ${roomId}`);
  });

  socket.on("joinRoom", (roomId) => {
    if (rooms.has(roomId)) {
      socket.join(roomId);
      rooms.get(roomId).users.add(socket.id);
      socket.emit("roomJoined", roomId);
      socket.emit("updateLiftState", rooms.get(roomId).liftState);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    } else {
      socket.emit("roomNotFound");
      console.log(`Room not found: ${roomId}`);
    }
  });

  socket.on("updateLiftState", ({ roomId, liftState }) => {
    if (rooms.has(roomId)) {
      rooms.get(roomId).liftState = liftState;
      io.to(roomId).emit("updateLiftState", liftState);
      console.log(`Lift state updated in room ${roomId}:`, liftState);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    rooms.forEach((room, roomId) => {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        console.log(
          `User ${socket.id} removed from room ${roomId}. ${room.users.size} users remaining.`,
        );
        if (room.users.size === 0) {
          rooms.delete(roomId);
          console.log(`Room deleted: ${roomId}`);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
