import express from "express";
import { WebSocketServer } from "ws";

const app = express();

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Actually we have to build web sockets on connection on sma HTTP port that server is running on that's why we are passing the server

// If you change the port of sockets connection something like on PORT:3000 so you pass as:- {port:3000}
const wss = new WebSocketServer({
  server,
});

wss.on("connection", (ws) => {
  // ye message mujhe ek data laakr ke dega jisko mai console kara raha hu
  ws.on("message", (data) => {

    // Yahn jo message console hoga wo buffer data hoga toh isko hum meaningful data bnane ke liye %s ka use kar rahe hai.
    console.log("Data from Client %s: ", data);

    // server yahan se message send kar raha hai "Thanks Buddy"
    ws.send("Thanks Buddy!");
  });
});
