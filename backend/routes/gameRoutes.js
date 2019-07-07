import { Chat } from "../models";

const express = require("express");
const router = express.Router();

/**
 * GET /game/chat/
 * returns all chat messages
 */
router.get("/chat", async (req, res) => {
  const messages = await Chat.find({});
  return res.status(200).json(messages);
});

/**
 * POST /game/chat/
 * add new chat message
 * send it with socket.io
 */
router.post("/chat", async (req, res) => {
  const { userId } = req.body;

  const io = req.app.get("socketio");

  return res.json("Good");
});

module.exports = router;
