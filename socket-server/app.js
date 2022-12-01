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
const roomsArray = [];

const io = socketIo(server);

io.on("connection", (socket) => {

  //console.log(users)
  console.log('rooms :', roomsArray)

  io.emit("roomData", roomsArray);

  socket.on("newUser", (username) => {
    let lastRoom = roomsArray[roomsArray.length - 1]
    let room = null
    if(roomsArray.length === 0){
      socket.join("room 1");
      room = 'room 1'
    }else{
      const words = lastRoom.split(' ');
      room = 'room ' + (parseInt(words[1]) + 1)
      socket.join(room);
    }
    roomsArray.push(room)

    const newUser = {
      id: users.length,
      name: username,
      socketId: room,
      restaurant: {},
    };

    users.push(newUser);
    let usersInRoom = []
    users.forEach(user=>{
      if(user.socketId === room){
        usersInRoom.push(user)
      }
    })

    io.to(room).emit("getUsers", usersInRoom);
    io.to(room).emit("userJoined", usersInRoom);
    io.to(room).emit("userData", newUser);
    io.emit("roomData", roomsArray);

    console.log(roomsArray)

  });

  socket.on("joinRoom", (username, room) => {
    const newUser = {
      id: users.length,
      name: username,
      socketId: room,
      restaurant: {},
    };

    socket.join(room);
    users.push(newUser);

    let usersInRoom = []
    users.forEach(user=>{
      if(user.socketId === room){
        usersInRoom.push(user)
      }
    })

    io.emit("userJoined", usersInRoom);
  });

  });

server.listen(port, () => console.log(`Listening on port ${port}`));
