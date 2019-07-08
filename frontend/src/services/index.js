import api from "./api";

const connectToGameRequest = nickname => {
  return api({
    method: "POST",
    url: "/connect-to-game-request",
    body: { nickname }
  })
}

export { connectToGameRequest };
