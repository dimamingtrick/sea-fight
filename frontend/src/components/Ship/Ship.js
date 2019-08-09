import React from "react";
import { CSSTransition } from "react-transition-group";

import { gameAreaCols } from "../../helpers";

const Ship = ({
  coordinates: { rowIndex, colIndex },
  handleClick,
  blockId,
  ship,
  isShooted = false,
  isMissed = false
}) => {
  return (
    <div onClick={handleClick} id={blockId} className="area-col">
      <CSSTransition
        in={ship !== undefined}
        timeout={250}
        classNames="fadeIn250"
        unmountOnExit
      >
        <div
          id={ship && ship.shipId}
          className={`ship my-ship ${isShooted ? "shooted" : ""} ${isMissed &&
            "missed-shot"}`}
        />
      </CSSTransition>
      {rowIndex === 0 && (
        <div className="area-col-name">{gameAreaCols[colIndex].id}</div>
      )}
    </div>
  );
};

export default Ship;
