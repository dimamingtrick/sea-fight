import { verify } from "jsonwebtoken";
import { Chat, ChatMessage, User } from "../models";
const objectId = require("mongodb").ObjectID;

/**
 * JWT validation function
 * if token is valid adds decoded userId to req.body
 * if token is not valid returns error
 */
const jwtValidate = (req, res, next) => {
  verify(req.headers["token"], "ming_trick", (err, decoded) => {
    if (err) {
      return res.status(400).json({ status: "error", message: err.message });
    } else {
      if (Date.now > decoded.exp) {
        return res.json({ status: "error", message: "Token has been expired" });
      }

      req.body.userId = decoded.id; // add user id to request
      next();
    }
  });
};

const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Returns new random word object from all words array
 */
const getNewRandomWord = allWords => {
  const newWord = allWords[Math.floor(Math.random() * allWords.length)];
  return newWord;
};

const getUnreadChatsCount = async (io, userId) => {
  const chats = await Chat.find({ users: objectId(userId) });

  let unreadMessagesCount = 0;
  await Promise.all(
    chats.map(async i => {
      let unreadMessages = await ChatMessage.find({
        chatId: objectId(i._id),
        readBy: {
          $ne: objectId(userId),
        },
      });

      if (unreadMessages.length > 0) unreadMessagesCount++;
    })
  );
  io.emit(`${userId}-chatsWithUnreadMessages`, unreadMessagesCount);
};

const getUnreadChatMessagesCount = async (chatId, userId) => {
  const unreadChatMessages = await ChatMessage.find({
    chatId: objectId(chatId),
    readBy: {
      $ne: objectId(userId),
    },
  });
  return unreadChatMessages.length;
};

const toggleUserOnlineStatus = (userId, isOnline, io) => {
  User.findOneAndUpdate(
    {
      _id: objectId(userId),
    },
    {
      $set: {
        isOnline,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (!err && updatedUser) io.emit("userOnlineStatusChanged", updatedUser);
    }
  );
};

export {
  jwtValidate,
  validateEmail,
  getNewRandomWord,
  getUnreadChatsCount,
  getUnreadChatMessagesCount,
  toggleUserOnlineStatus,
};
