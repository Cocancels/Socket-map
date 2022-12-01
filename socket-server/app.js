const express = require("express");
const http = require("http");
const socketIo = require("socket.io", {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 4001;
const index = require("./index");

const app = express();
app.use(index);

const server = http.createServer(app);

const rooms = {};

app.get("/rooms", (req, res) => {
  res.status(200).json(rooms);
});

const io = socketIo(server);

io.on("connection", (socket) => {
  socket.room = socket.handshake.auth.room;
  socket.username = socket.handshake.auth.username;

  console.log("New client connected", socket.room);

  if (!rooms[socket.room]) {
    rooms[socket.room] = {
      users: [],
      finalPosition: {
        lat: 0,
        lng: 0,
      },
      currentUser: null,
    };
  }

  const newUser = {
    id: rooms[socket.room].users.length,
    name: socket.username,
    room: socket.room,
    socketId: socket.id,
    restaurant: {},
    position: {},
  };

  socket.emit("init", { ...rooms[socket.room], currentUser: newUser });
  rooms[socket.room].users.push(newUser);
  io.to(socket.room).emit("newUser", rooms[socket.room].users);

  socket.join(socket.room);

  socket.on("updateCurrentUserPosition", ({ position, user }) => {
    rooms[socket.room].users.map((u) => {
      if (u.id === user.id) {
        u.position = position;
      }
    });

    io.to(socket.room).emit("getUpdatedUserPosition", rooms[socket.room].users);
  });

  socket.on("updateCurrentUserRestaurant", ({ restaurant, user }) => {
    rooms[socket.room].users.map((u) => {
      if (u.id === user.id) {
        u.restaurant = restaurant;
      }
    });

    io.to(socket.room).emit(
      "getUpdatedUserRestaurant",
      rooms[socket.room].users
    );
  });

  socket.on("updateFinalPosition", (finalPos) => {
    const finalPosition = {
      lat: finalPos.lat,
      lng: finalPos.lng,
    };
    io.to(socket.room).emit("getFinalPosition", finalPosition);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
