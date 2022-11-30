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

const users = [
  {
    id: 0,
    name: "John",
    socketId: 1,
    position: {
      lat: 65,
      lng: 4,
    },
    restaurant: {
      id: 1,
      name: "Le Vieux Pressoir, Restaurant & Pizzeria",
      image:
        "https://lh5.googleusercontent.com/p/AF1QipP9DL1FNPTRMLFtCSfH_K85KDjNC__td4XlrGCH=w408-h306-k-no",
      position: {
        lat: 4.17707768049819,
        lng: 6.13789117200385,
      },
    },
  },
];

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
    io.to("room1").emit("userJoined", users);
    io.to("room1").emit("userData", newUser);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
