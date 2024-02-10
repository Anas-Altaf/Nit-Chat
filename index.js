const http = require("http");
const express = require("express");
const path = require("path"); // Import the path module
const socketio = require("socket.io");

const app = express();

//Express STuff
app.use("/static", express.static("static"));
const server = http.createServer(app);
const io = socketio(server);

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

// Define the path to the current directory
const currentDirPath = __dirname;

// End Points
app.get("/", (req, res) => {
  // Serve the index.html file from the current directory
  res.sendFile("index.html", { root: currentDirPath });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
