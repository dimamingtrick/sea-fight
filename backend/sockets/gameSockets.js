let users = [{ nickname: "test" }];

const gameSocket = (socket, io) => {
  /**
   * Detect user enters nickname and send request to start game
   */
  socket.on("userIsOnline", nickname => {
    users.push({ nickname, socketId: socket.id });
  });
};

module.exports = { users, gameSocket };
