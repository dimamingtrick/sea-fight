import React from "react";
// import { Switch, Route, Redirect } from "react-router-dom";
// import { TransitionGroup, CSSTransition } from "react-transition-group";
// import socketIOClient from "socket.io-client";

// let socket = null;
// const serverUrl = `${process.env.REACT_APP_SERVER}/`;

// const routes = [
//   "/app",
//   "/app/game",
//   "/app/chats",
//   "/app/todolist",
//   "/app/game-words",
//   "/app/profile",
// ];
// let routeKey; // Define key to have transition only between 3 routes, declared below inside switch
// if (!socket && userId) {
//   socket = socketIOClient(serverUrl);
//   socket.on("socketWorks", ({ horray }) => {
//     console.log(horray); // Check if socket works
//     socket.emit("userIsOnline", userId);
//   });
// }

const HomePage = () => {
  return <div>Home Page</div>;
};

// export { socket };
export default HomePage;
