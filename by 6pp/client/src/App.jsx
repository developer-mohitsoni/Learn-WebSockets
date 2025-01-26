import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  // Agar yadi mera frontend or backend wo yadi same port par hoge to humko io() ke andar kuch bhi paas karne ki jaroorat nai hai. Par kuki yahan dono frontend or backend dono different port par listen ho rahe hai toh yahan io() ke andar humko backend ka url paas karna hoga.

  // Iss case ke duran humko cors error aa skti hai jisko ki hum backend side par resolve karte hai.
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [roomName, setRoomName] = useState("");

  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.emit("message", { message, room });

    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();

    socket.emit("join-room", roomName);

    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("Connected to server", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);
  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ height: 150 }} />
        <Typography variant="h6" component="div" gutterBottom>
          {socketID}
        </Typography>

        <form onSubmit={joinRoomHandler}>
          <h5>Join Room</h5>
          <TextField
            value={roomName}
            id="outlined-basic"
            label="Room Name"
            variant="outlined"
            onChange={(e) => setRoomName(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </form>

        <form onSubmit={handleSubmit}>
          <TextField
            value={message}
            id="outlined-basic"
            label="Message"
            variant="outlined"
            onChange={(e) => setMessage(e.target.value)}
          />
          <TextField
            value={room}
            id="outlined-basic"
            label="Room"
            variant="outlined"
            onChange={(e) => setRoom(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>
        <Stack>
          {messages.map((m, i) => (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {m}
            </Typography>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default App;
