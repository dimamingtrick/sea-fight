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

const yourShips = [
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

function getCoords(elem) {
  const box = elem.getBoundingClientRect();
  return {
    top: box.top,
    left: box.left,
  };
}

let elemIsDragging = false;
let draggingOverArea = false;
let lastHoveredItem = null;
/**
 * GAME COMPONENT
 */
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

  const dragShip = e => {
    elemIsDragging = true;
    const ship = e.target;
    const coords = getCoords(ship);
    const shiftX = e.pageX - coords.left;
    const shiftY = e.pageY - coords.top;

    ship.style.position = "absolute";
    ship.style.zIndex = 1000;
    ship.style.pointerEvents = "none";

    function moveAt(e) {
      ship.style.left = e.pageX - shiftX + "px";
      ship.style.top = e.pageY - shiftY + "px";
    }

    moveAt(e);

    document.onmousemove = e => {
      if (e.target.className === "area-col") {
        lastHoveredItem = e.target;
      } else {
        if (lastHoveredItem) lastHoveredItem = null;
      }
      moveAt(e);
    };

    document.onmouseup = e => {
      elemIsDragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
      ship.style.pointerEvents = "auto";
      if (draggingOverArea && lastHoveredItem) {
        draggingOverArea = false;
        const shipRemove = document.getElementById(ship.id);
        shipRemove.parentNode.removeChild(shipRemove);
        setShips([...ships, { blockId: lastHoveredItem.id, shipId: ship.id }]);
      }
    };
  };

  const mouseOverArea = () => {
    if (elemIsDragging && !draggingOverArea) {
      draggingOverArea = true;
    }
  };

  return (
    <Container>
      <div id="gameArea" className="game-area" onMouseMove={mouseOverArea}>
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
                        id={ships.find(i => i.blockId === blockId).shipId}
                        onDragStart={() => false}
                        onMouseDown={dragShip}
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
      <Row className="ships-row" id="shipsRow">
        {yourShips.map(i => (
          <div
            onDragStart={() => false}
            onMouseDown={dragShip}
            key={i.id}
            id={i.id + "ship"}
            className="ship"
          />
        ))}
      </Row>
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
