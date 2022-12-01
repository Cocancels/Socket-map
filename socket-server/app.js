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

const users = [];

const finalPosition = {
  lat: 0,
  lng: 0,
};

const io = socketIo(server);

io.on("connection", (socket) => {
  socket.join("room1");
  io.to("room1").emit("getUsers", users);

  socket.on("newUser", (username) => {
    const newUser = {
      id: users.length,
      name: username,
      socketId: socket.id,
      restaurant: {},
      position: {},
    };

    users.push(newUser);
    io.to("room1").emit("newUser", users);
  });

  socket.on("updateCurrentUserPosition", ({ position, user }) => {
    users.map((u) => {
      if (u.id === user.id) {
        u.position = position;
      }
    });

    io.to("room1").emit("getUpdatedUserPosition", users);
  });

  socket.on("updateCurrentUserRestaurant", ({ restaurant, user }) => {
    users.map((u) => {
      if (u.id === user.id) {
        u.restaurant = restaurant;
      }
    });

    io.to("room1").emit("getUpdatedUserRestaurant", users);
  });

  socket.on("updateFinalPosition", (finalPos) => {
    finalPosition.lat = finalPos.lat;
    finalPosition.lng = finalPos.lng;
    io.to("room1").emit("getFinalPosition", finalPosition);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
