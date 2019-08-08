class User {
  constructor({ nickname, socketId }) {
    this.nickname = nickname;
    this.socketId = socketId;
    this.isSearching = false;
    this.isReady = false;
  }
}

export default User;
