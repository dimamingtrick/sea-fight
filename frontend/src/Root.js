import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Container } from "reactstrap";

import HomePage from "./pages/HomePage/HomePage";
import PlayerDetailsPage from "./pages/PlayerDetailsPage/PlayerDetailsPage";
import GamePage from "./pages/GamePage/GamePage";

const Root = () => {
  return (
    <div className="App">
      <Container>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/player-details" component={PlayerDetailsPage} />
          <Route path="/game" component={GamePage} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Container>
    </div>
  );
};

export default Root;
