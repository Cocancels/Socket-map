const express = require("express");
const http = require("http");
const socketIo = require("socket.io"(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
}));

const port = process.env.PORT || 4001;
const index = require("./index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

const fakeUsers = [
  { id: 1, name: "John" },
  { id: 2, name: "Mike" },
  { id: 3, name: "Mary" },
];

io.on("connection", (socket) => {
  console.log("New client connected");

  // if socket listen to "join-room" event, then do something
  socket.on("join-room", (roomId, userId) => {
    console.log("join-room", roomId, userId);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
