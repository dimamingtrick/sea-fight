import uniqid from "uniqid";

import { User } from "../models";

/**
 * All users online
 */
let users = [];

/**
 * All games in proccess
 * Game is creating when user starts searching for it
 */
let games = [{}];

const gameSocket = (socket, io) => {
  /**
   * Detect user enters nickname and send request to start game
   */
  socket.on("userIsOnline", nickname => {
    if (nickname) {
      const newUser = new User({
        nickname,
        socketId: socket.id
      });
      users.push(newUser);
    }
  });

  /**
   * Detect when user disconnect
   */
  socket.on("disconnect", () => {
    users = users.filter(i => i.socketId !== socket.id);
  });

  /**
   * User searching for a game
   */
  socket.on("search-game", () => {
    let newGame = games.find(i => i && i.users && i.users.length === 1);

    if (newGame) {
      const me = users.find(i => i.socketId === socket.id);
      newGame.users.push({
        user: me,
        ships: []
      });
    } else {
      newGame = {
        id: uniqid(),
        isStarted: false,
        users: [
          {
            user: users.find(i => i && i.socketId === socket.id),
            ships: [],
            attacks: false
          }
        ]
      };
      games.push(newGame);
    }

    users = users.map(i => {
      if (i.socketId === socket.id) {
        i.isSearching = false;
      }
      return i;
    });
    if (newGame.users.length === 2) {
      newGame.users.forEach(u => {
        io.to(`${u.user.socketId}`).emit("gameSearchComplete", newGame);
      });
    }
  });

  socket.on("readyForAGame", ({ gameId, ships }) => {
    const game = games.find(g => g.id === gameId);

    game.users = game.users.map(u => {
      if (u.user.socketId === socket.id) {
        u.user.isReady = true;
        u.ships = ships;
      }
      return u;
    });

    if (game.users.every(u => u.user.isReady)) {
      game.isStarted = true;
      game.users[0].attacks = true;
      game.users.forEach(({ user }) => {
        io.to(`${user.socketId}`).emit("gameStarted", game);
      });
    } else {
      const enemy = game.users.find(u => u.user.socketId !== socket.id);
      io.to(`${enemy.user.socketId}`).emit("enemyIsReady");
    }
  });
};

module.exports = { users, gameSocket };
