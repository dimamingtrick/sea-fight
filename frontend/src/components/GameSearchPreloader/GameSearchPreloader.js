import React from "react";
import { CSSTransition } from "react-transition-group";

import "./game-search-preloader.scss";

const GameSearchPreloader = ({ show }) => (
  <CSSTransition in={show} timeout={500} classNames="fadeInOut" unmountOnExit>
    <div className="game-preloader">
      <div className="black-bg" />
      <div className="preloader-content">
        <div className="windows8">
          <div className="wBall" id="wBall_1">
            <div className="wInnerBall" />
          </div>
          <div className="wBall" id="wBall_2">
            <div className="wInnerBall" />
          </div>
          <div className="wBall" id="wBall_3">
            <div className="wInnerBall" />
          </div>
          <div className="wBall" id="wBall_4">
            <div className="wInnerBall" />
          </div>
          <div className="wBall" id="wBall_5">
            <div className="wInnerBall" />
          </div>
        </div>
        <span>Searching for a game</span>
      </div>
    </div>
  </CSSTransition>
);

export default GameSearchPreloader;
