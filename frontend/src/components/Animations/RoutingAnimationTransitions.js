import React from "react";
import { CSSTransition } from "react-transition-group";

/**
 * Use in Router child (instead of component/render) prop;
 */
const Fade = (Page, navProps) => {
  return (
    <CSSTransition
      in={navProps.match != null}
      timeout={150}
      classNames="fadingRoute"
      unmountOnExit
    >
      <Page {...navProps} />
    </CSSTransition>
  );
};

export { Fade };
