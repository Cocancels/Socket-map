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
    };

    users.push(newUser);
    io.to("room1").emit("userJoined", users);
    io.to("room1").emit("userData", newUser);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
