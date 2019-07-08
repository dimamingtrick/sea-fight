import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import socketIOClient from "socket.io-client";

import "./game.scss";

let socket = null;
const serverUrl = `${process.env.REACT_APP_SERVER}/`;

const gameAreaRows = [
  { id: "A" },
  { id: "B" },
  { id: "C" },
  { id: "D" },
  { id: "E" },
  { id: "F" },
  { id: "G" },
  { id: "H" },
  { id: "I" },
  { id: "J" },
];
const gameAreaCols = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
];

const GamePage = ({ history, location }) => {
  const [nickname] = useState(
    localStorage.getItem("nickname")
      ? localStorage.getItem("nickname")
      : location.state.nickname
  );

  const [socketStatus, setSocketStatus] = useState(false);
  const [lastClickedElement, setLastClickedElement] = useState(null);
  const [ships, setShips] = useState([]);

  useEffect(() => {
    if (nickname) {
      socket = socketIOClient(serverUrl);
      socket.on("socketWorks", ({ horray }) => {
        console.log(horray);
        socket.emit("userIsOnline", nickname);
        setSocketStatus(true);
      });
    } else {
      history.push("/");
    }
  }, []);

  const handleBlockClick = blockId => {
    const blockChild = document.getElementById(blockId);
    console.log(blockChild);
    setLastClickedElement(blockId);
    if (ships.find(i => i.blockId === blockId)) {
      setShips(ships.filter(i => i.blockId !== blockId));
    } else {
      setShips([...ships, { blockId }]);
    }
  };

  // const removeShip = blockId => {
  //   console.log(blockId);
  //   setShips(ships.filter(i => i.id !== blockId));
  // };

  return (
    <Container>
      <div className="game-area">
        {gameAreaRows.map((row, rowIndex) => {
          return (
            <div key={row.id} className="area-row">
              <div className="area-row-name">{row.id}</div>

              {gameAreaCols.map((col, colIndex) => {
                const blockId = `${row.id}-${col.id}`;
                return (
                  <div
                    onClick={() => handleBlockClick(blockId)}
                    key={blockId}
                    id={blockId}
                    className="area-col"
                  >
                    {ships.find(i => i.blockId === blockId) && (
                      <div
                        // onClick={() => removeShip(blockId)}
                        className="ship"
                      />
                    )}
                    {rowIndex === 0 && (
                      <div className="area-col-name">
                        {gameAreaCols[colIndex].id}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <Row>Nickname - {nickname}</Row>
      <Row>Last clicked element id - {lastClickedElement}</Row>
      <Row>
        Socket status -{" "}
        {socketStatus ? "Sockets works" : "Sockets are not working"}
      </Row>
      <Row>
        <Col className="text-align-center" sm={{ size: 4, offset: 4 }}>
          GAME PAGE!
        </Col>
      </Row>
    </Container>
  );
};

export default GamePage;
