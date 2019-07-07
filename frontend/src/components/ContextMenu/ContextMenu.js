import React, { useState, useEffect, useRef } from "react";
import "./context-menu.css";

function ContextMenu({
  children,
  onContextMenuOpen,
  showContextMenu,
  onContextMenuClose = () => {},
}) {
  const [visible, setVisible] = useState(false);
  const root = useRef(null);

  const closeContextMenu = () => {
    onContextMenuClose();
    setVisible(false);
  };

  const _handleContextMenu = event => {
    if (showContextMenu(event)) {
      event.preventDefault();
      setVisible(true);

      onContextMenuOpen(event || null);

      const clickX = event.clientX;
      const clickY = event.clientY;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const rootW = root.current.offsetWidth;
      const rootH = root.current.offsetHeight;

      const right = screenW - clickX > rootW;
      const left = !right;
      const top = screenH - clickY > rootH;
      const bottom = !top;

      if (right) {
        root.current.style.left = `${clickX + 5}px`;
      }

      if (left) {
        root.current.style.left = `${clickX - rootW - 5}px`;
      }

      if (top) {
        root.current.style.top = `${clickY + 5}px`;
      }

      if (bottom) {
        root.current.style.top = `${clickY - rootH - 5}px`;
      }
    } else {
      closeContextMenu();
    }
  };

  const _handleClick = event => {
    const wasOutside = !(event.target.contains === root.current);
    if (wasOutside && visible) {
      closeContextMenu();
    }
  };

  const _handleScroll = () => {
    if (visible) {
      closeContextMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("click", _handleClick);
    document.addEventListener("scroll", _handleScroll);
    return () => {
      document.removeEventListener("click", _handleClick);
      document.removeEventListener("scroll", _handleScroll);
    };
  }, [visible]);

  useEffect(() => {
    document.addEventListener("contextmenu", _handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", _handleContextMenu);
    };
  });

  return (
    (visible || null) && (
      <div ref={root} className="contextMenu">
        <div className="menu-options">{children}</div>
      </div>
    )
  );
}

export default ContextMenu;
