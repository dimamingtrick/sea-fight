import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button } from "reactstrap";
import socketIOClient from "socket.io-client";

import GameSearchPreloader from "../../components/GameSearchPreloader/GameSearchPreloader";
import { gameAreaRows, gameAreaCols } from "../../helpers";
import "./game.scss";

let socket = null;
const serverUrl = `${process.env.REACT_APP_SERVER}/`;

let warningTimeout;

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
  const [gameIsSearching, setGameIsSearching] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [ships, setShips] = useState([]);
  const [enemyShips, setEnemyShips] = useState([]);
  const [maxShips, setMaxShips] = useState(10);
  const [warningAlert, setWarningAlert] = useState("");
  const [isReadyStatus, setIsReadyStatus] = useState({
    my: false,
    enemy: false
  });

  useEffect(() => {
    if (nickname) {
      socket = socketIOClient(serverUrl);
      socket.on("socketWorks", ({ horray }) => {
        socket.emit("userIsOnline", nickname);
        setSocketStatus(true);
        socket.emit("search-game");
      });
    } else {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    setMaxShips(10 - ships.length);
  }, [ships]);

  useEffect(() => {
    if (warningAlert) {
      warningTimeout = setTimeout(() => {
        if (warningAlert) setWarningAlert("");
      }, 2000);
    } else {
      clearTimeout(warningTimeout);
    }
  }, [warningAlert]);

  useEffect(() => {
    socket.on("gameSearchComplete", gameData => {
      setGameIsSearching(false);
      setGameData(gameData);
    });
    socket.on("enemyIsReady", () => {
      setIsReadyStatus({
        my: false,
        enemy: true
      });
    });
    socket.on("gameStarted", gameData => {
      setGameData(gameData);
    });
    socket.on(
      "shipWasShooted",
      ({ shootedShip, shooter, gameWinner = null }) => {
        console.log("GAME WINNER", gameWinner);
        if (shooter.nickname === nickname) {
          setEnemyShips([...enemyShips, shootedShip]);
        } else {
          const updatedShips = ships.map(s => {
            if (s.blockId === shootedShip.blockId) s = shootedShip;
            return s;
          });
          setShips(updatedShips);
        }

        if (gameWinner) {
          setGameData({
            ...gameData,
            isComplete: true,
            winner: gameWinner.user
          });
        }
      }
    );
    socket.on("shotMissed", ({ gameData, blockId, shooter }) => {
      if (shooter.nickname === nickname) {
        setEnemyShips([...enemyShips, { blockId }]);
      }
      setGameData(gameData);
    });
    return () => {
      socket.off("gameSearchComplete");
      socket.off("enemyIsReady");
      socket.off("gameStarted");
      socket.off("shipWasShooted");
      socket.off("shotMissed");
    };
  });

  const handleBlockClick = (blockId, area = "my") => {
    if (area === "my") {
      if (gameData.isStarted) return;

      if (ships.find(i => i.blockId === blockId)) {
        setShips(ships.filter(i => i.blockId !== blockId));
      } else {
        if (maxShips !== 0) setShips([...ships, { blockId }]);
        else setWarningAlert("You've already set all ships to fight area!");
      }
    } else {
      if (!gameData.isStarted) return;

      const { user } = gameData.users.find(u => u.attacks);
      if (user.nickname === nickname) {
        if (enemyShips.find(i => i.blockId === blockId)) {
          setEnemyShips(enemyShips.filter(i => i.blockId !== blockId));
        } else {
          socket.emit("setAttack", { gameId: gameData.id, blockId });
          // setEnemyShips([...enemyShips, { blockId }]);
        }
      }
    }
  };

  const handleReadyForAGame = () => {
    if (ships.length < 10)
      return setWarningAlert("You must add 10 ships to start the game");

    socket.emit("readyForAGame", { gameId: gameData.id, ships });
    setIsReadyStatus({
      my: true,
      enemy: isReadyStatus.enemy
    });
  };
  console.log(gameData);
  return (
    <>
      <GameSearchPreloader
        show={
          gameIsSearching ||
          (isReadyStatus.my && gameData && !gameData.isStarted)
        }
        text={
          isReadyStatus.my && gameData && !gameData.isStarted
            ? "Waiting for other member to be ready..."
            : "Searching for a game..."
        }
      />
      <Container>
        <Row>
          <Col>
            {gameData && !gameData.isStarted && isReadyStatus.enemy && (
              <h1>Enemy is ready</h1>
            )}
            {gameData && gameData.isStarted && <h1>GAME IS STARTED</h1>}
          </Col>
        </Row>
        <Row className="game-buttons">
          <Col>
            <Button onClick={handleReadyForAGame} outline color="success">
              Ready
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="game-area-col">
            {/** User ships */}
            <div id="gameArea" className="game-area">
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
                              className={`ship my-ship ${
                                ships.find(
                                  i => i.blockId === blockId && i.isShooted
                                )
                                  ? "shooted"
                                  : ""
                              }`}
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
          </Col>

          <Col className="game-area-col">
            {/** Enemy ships */}
            <div id="enemyArea" className="game-area">
              {gameAreaRows.map((row, rowIndex) => {
                return (
                  <div key={row.id} className="area-row">
                    <div className="area-row-name">{row.id}</div>
                    {gameAreaCols.map((col, colIndex) => {
                      const blockId = `${row.id}-${col.id}`;
                      return (
                        <div
                          onClick={() => handleBlockClick(blockId, "enemy")}
                          key={blockId}
                          id={blockId}
                          className="area-col"
                        >
                          {enemyShips.find(i => i.blockId === blockId) && (
                            <div
                              id={
                                enemyShips.find(i => i.blockId === blockId)
                                  .shipId
                              }
                              onDragStart={() => false}
                              className={`ship enemy-ship ${
                                enemyShips.find(
                                  i => i.blockId === blockId && i.isShooted
                                )
                                  ? "shooted"
                                  : ""
                              }`}
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
          </Col>
        </Row>
        <Row>{maxShips}</Row>
        <Row>Nickname - {nickname}</Row>
        <Row>
          Socket status -{" "}
          {socketStatus ? "Sockets works" : "Sockets are not working"}
        </Row>
        <Alert
          className="ships-warning-alert"
          isOpen={warningAlert !== ""}
          color="danger"
        >
          {warningAlert}
        </Alert>
        {gameData && (
          <Alert
            className="ships-warning-alert"
            isOpen={gameData && gameData.isComplete && gameData.winner !== null}
            color="success"
          >
            Game is over! The winner is
            {gameData.winner && gameData.winner.nickname}!
          </Alert>
        )}
      </Container>
    </>
  );
};

export default GamePage;
