import { createServer } from "node:http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import "dotenv/config";

const app = express();

const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
		allowedHeaders: ["Content-Type", "Authorization"],
	},
});

app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	}),
);

const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

const user = false;

// Middleware

/*
io.use((socket, next) => {
  // Yahan user "false" hoga toh sockets kabhi connect nai hoga, basically ye debugging ke liye use kiya jaa skta hai.
  if (user) next();
});
*/

//! End if middleware
io.on("connection", (socket) => {
	console.log("User Connected", socket.id);
	// socket.emit("welcome", `Welcome to the server`);
	// socket.broadcast.emit("welcome", `${socket.id} joined the server`);

	socket.on("message", (data) => {
		// console.log(data);

		// io.emit("receive-message", data)
		// socket.broadcast.emit("receive-message", data)

		console.log(data.room, data.message);

		io.to(data.room).emit("receive-message", data.message);

		//* These both doesn't care at this case
		// socket.to(data.room).emit("receive-message", data.message);

		socket.on("join-room", (room) => {
			socket.join(room);

			console.log(`User joined room ${room}`);
		});
	});

	socket.on("disconnect", () => {
		console.log("User disconnected");
		// socket.broadcast.emit("goodbye", `${socket.id} left the server`);
	});
});

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
