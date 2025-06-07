const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const wServer = express();
const server = http.createServer(wServer);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Map userId => socket.id
const userSocketMap = {};
const getRecieverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Notify all clients of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Join group room (for group chat)
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`Socket ${socket.id} joined group ${groupId}`);
  });

  // Handle sending message (either DM or group)
  socket.on("sendMessage", ({ to, from, message, isGroup }) => {
    if (isGroup) {
      // Broadcast to group except sender
      socket.to(to).emit("receiveNotification", {
        from,
        message,
        groupId: to,
        type: "group",
      });
    } else {
      const receiverSocketId = getRecieverSocketId(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveNotification", {
          from,
          message,
          type: "direct",
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { wServer, server, io, getRecieverSocketId };


