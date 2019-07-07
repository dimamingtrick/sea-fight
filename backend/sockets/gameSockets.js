module.exports = (socket, io) => {
  /**
   * Detect when admin enter game
   */
  socket.on("adminEnterGame", () => {
    io.emit("adminIsInTheGame");
  });

  /**
   * Detect when admin leave game
   */
  socket.on("adminLeaveTheGame", () => {
    io.emit("adminIsNotInTheGame");
  });
};
