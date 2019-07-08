const express = require("express");
const cors = require("cors");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

/** Add express body parser to convert request body params */
app.use(express.json());

/** Add socket.io object to every request by req.app.get("socketio") */
app.set("socketio", io);

/** Add cors to server */
app.use(cors());

/**
 * GET /
 * Basic default route to initiate server
 */
app.get("/", async (req, res) => {
  return res.json("Good game");
});

/**
 * POST /connect-to-game-request
 * When user send nickname and want's to connect and start game
 */
app.post("/connect-to-game-request", async (req, res) => {
  const { nickname } = req.body;

  if (!nickname)
    return res.status(400).json({ message: "You must enter nickname" });

  const users = require("./sockets/gameSockets").users;

  if (users.find(u => u.nickname === nickname))
    return res
      .status(400)
      .json({ message: "Nickname is already exists. Select another one" });

  return res.json({ message: "Success" });
});

/**
 * Start node.js server
 * Then require all sockets from different modules
 */
server.listen(3001, function() {
  io.on("connection", socket => {
    socket.emit("socketWorks", { horray: "Horray" });

    app.set("socket", socket);

    /** Use game sockets */
    require("./sockets/gameSockets").gameSocket(socket, io);
  });
});
