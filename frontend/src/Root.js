import React from "react";
import HomePage from "./pages/HomePage/HomePage";
import GamePage from "./pages/GamePage/GamePage";
import { Switch, Route, Redirect, Link } from "react-router-dom";

const Root = () => {
  return (
    <div className="App">
      <div
        style={{
          display: "flex",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/game">Game</Link>
      </div>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/game" component={GamePage} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
};

export default Root;
