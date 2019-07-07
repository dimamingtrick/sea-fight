import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chatMessage",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Chat = mongoose.model("chat", chatSchema);

export default Chat;
