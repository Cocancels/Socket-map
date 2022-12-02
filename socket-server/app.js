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

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
const server = http.createServer(app);

const rooms = {};

const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "gold",
  "black",
  "violet",
  "grey",
];

// function to get random color
const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

app.get("/rooms", (req, res) => {
  res.status(200).json(rooms);
});

const io = socketIo(server);

io.on("connection", (socket) => {
  socket.room = socket.handshake.auth.room;
  socket.username = socket.handshake.auth.username;

  if (socket.room === "default") {
    socket.room = "room" + Object.keys(rooms).length;
    rooms[socket.room] = {
      name: socket.room,
      messages: [],
      users: [],
      finalPosition: {
        lat: 0,
        lng: 0,
      },
      currentUser: null,
      usedColors: [],
    };
  }

  let newUserColor = getRandomColor();

  rooms[socket.room].usedColors.forEach((color) => {
    if (color === newUserColor) {
      newUserColor = getRandomColor();
    }
  });

  const newUser = {
    id: rooms[socket.room].users.length,
    name: socket.username,
    room: socket.room,
    socketId: socket.id,
    restaurant: {},
    position: {},
    color: newUserColor,
  };

  socket.emit("init", { ...rooms[socket.room], currentUser: newUser });
  rooms[socket.room].users.push(newUser);
  rooms[socket.room].usedColors.push(newUserColor);
  io.to(socket.room).emit("newUser", rooms[socket.room].users);

  const joinMessage = {
    user: newUser,
    message: `I just joined the room !`,
    createdAt: new Date(),
  };

  socket.join(socket.room);

  rooms[socket.room].messages.push(joinMessage);
  io.to(socket.room).emit("newMessage", rooms[socket.room].messages);

  socket.on("sendMessage", (message, user) => {
    const newMessage = {
      user: user,
      message: message,
      createdAt: new Date(),
    };
    rooms[socket.room].messages.push(newMessage);
    io.to(socket.room).emit("newMessage", rooms[socket.room].messages);
  });

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

  // socket on leave room
  socket.on("leaveRoom", (user) => {
    const leaveMessage = {
      user: user,
      message: `I just left the room !`,
      createdAt: new Date(),
    };

    rooms[socket.room].messages.push(leaveMessage);
    io.to(socket.room).emit("newMessage", rooms[socket.room].messages);

    rooms[socket.room].users = rooms[socket.room].users.filter(
      (u) => u.id !== user.id
    );

    rooms[socket.room].usedColors = rooms[socket.room].usedColors.filter(
      (c) => c !== user.color
    );

    io.to(socket.room).emit("newUser", rooms[socket.room].users);
  });

  socket.on("disconnect", () => {
    const leftMessage = newUser.name + " has left the room";
    const time = new Date();
    const newMessage = {
      user: newUser,
      message: leftMessage,
      createdAt: time,
    };
    rooms[socket.room].messages.push(newMessage);
    io.to(socket.room).emit("newMessage", rooms[socket.room].messages);

    rooms[socket.room].users = rooms[socket.room].users.filter(
      (user) => user.id !== newUser.id
    );
    io.to(socket.room).emit("newUser", rooms[socket.room].users);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
