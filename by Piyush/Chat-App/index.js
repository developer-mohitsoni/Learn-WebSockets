const http = require("http");
const express = require("express");

const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.io
io.on("connection", (socket) => {
  //   console.log("A new user has connected", socket.id);

  socket.on("myMessage", (message) => {
    // console.log("A new user message", message);

    // Ab ye server iss "myMessage" mai jo bhi message aa raha hoga wo sabb users ko emit kar dega mtlb show karega.

    // Taaki jo bhi users iss message ko listen karna chayega wo easily iss message ko listen kar skta hai jaise:- sockets.on("message", (message)=>{}) on frontend side.
    io.emit("message", message);
  });
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  return res.sendFile("index.html");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
