const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = 7000;

// app.get("/", (req, res) => {
//   res.status(200).json({ name: "Server" });
// });

{/*
  {
    nikhil: 11111111,
    devesh: 22222222
  }
*/}

const users = {};
const all_rooms = [];



io.on("connection", (socket) => {
  console.log("someone connecte and socket id " + socket.id);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);

    for (let user in users) {
      if (users[user] === socket.id) {
        delete users[user];
      }
    }    
  });


  socket.on("new_user", (username) => {
    console.log("Server : " + username);
    users[username] = socket.id;
    //we can tell every other users someone connected
    io.emit("all_rooms", all_rooms);
  });

  socket.on("createGroup", (roomName) => {
    console.log('room name'+roomName);
    all_rooms.push(roomName);
    io.emit("all_rooms", all_rooms);
  });


  socket.on("join_room", (data) => {

    const clients = io.sockets.adapter.rooms.get(data.roomName);

    let userAlreadExhist = false;
    if(clients) {
      clients.forEach(clientid => {
        if(clientid == socket.id) {
          userAlreadExhist = true;
        }
    });
    }
    //check if user already exhist
    if(!userAlreadExhist) {
      socket.join(data.roomName);
    io.to(data.roomName).emit('new_message',{type: 'new-user',msg: data.username+' just joined the room! '});    
    }   
    
  });


  socket.on("send_group_message",(data) => {
    
    io.to(data.roomName).emit('new_message',data);

  });


  



});

httpServer.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});



/*


  socket.on("new_user", (username) => {
    console.log("Server : " + username);
    users[username] = socket.id;

    //we can tell every other users someone connected
    io.emit("all_users", users);

  });

  

  socket.on("send_message", (data) => {

    const socketId = users[data.receiver];
    io.to(socketId).emit("new_message", data);

  });
  */