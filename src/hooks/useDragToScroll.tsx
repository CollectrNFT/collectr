import { useState } from "react";

export const useDragToScroll = ({ ref }) => {
  let initialPosition = { scrollLeft: 0, mouseX: 0 };
  const [isScrolling, setIsScrolling] = useState(false);

  const onMouseDown = (e: { clientX: number }) => {
    if (ref.current) {
      initialPosition = {
        scrollLeft: ref.current.scrollLeft,
        mouseX: e.clientX,
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  };
  const onMouseUp = () => {
    setTimeout(() => {
      setIsScrolling(false);
    }, 5); //set as a way to prevent clicking on scrollable items
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };
  const onMouseMove = (e) => {
    if (ref.current) {
      ref.current.style.userSelect = "none";
      setIsScrolling(true);
      const dx = e.clientX - initialPosition.mouseX;
      ref.current.scrollLeft = initialPosition.scrollLeft - dx;
    }
  };

  return { onMouseDown, isScrolling };
};
