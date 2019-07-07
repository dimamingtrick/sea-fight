import connectDb from "./models";
import express from "express";
import cors from "cors";

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

/** Make uploads directory public */
app.use(express.static(__dirname + "/uploads"));

/** Add express body parser to convert request body params */
app.use(express.json());

/** Add socket.io object to every request by req.app.get("socketio") */
app.set("socketio", io);

/** Add cors to server */
app.use(cors());

/**
 * Add /game routes (settings, etc)
 * Require JWT token
 */
app.use("/game", require("./routes/gameRoutes"));

/**
 * GET /
 * Basic default route to initiate server
 */
app.get("/", async (req, res) => {
  return res.json("Good game");
});

/**
 * Connecting to database
 * Then start node.js server
 * Then require all sockets from different modules
 */
connectDb().then(() => {
  server.listen(3001, function() {
    io.on("connection", socket => {
      app.set("socket", socket);
      /** Use game sockets */
      require("./sockets/gameSockets")(socket, io);
    });
  });
});
