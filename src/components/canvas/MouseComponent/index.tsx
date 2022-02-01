import mousePositionStore, { Icons } from "@/stores/mousePositionStore";
import { Box, useDisclosure } from "@chakra-ui/react";
import { useSpring, a } from "react-spring";
import React, { FC, useEffect, useRef } from "react";
import galleryStore, { ZoomLevels } from "@/stores/galleryStore";

export const MouseComponent: FC = () => {
  const mouseRef = useRef<HTMLDivElement>(null);

  const { icon, setIcon, isDrawerOpen } = mousePositionStore((state) => ({
    icon: state.icon,
    setIcon: state.setIcon,
    isDrawerOpen: state.isDrawerOpen,
  }));
  const { currentZoom, viewingAbout } = galleryStore((state) => ({
    currentZoom: state.currentZoom,
    viewingAbout: state.viewingAbout,
  }));

  useEffect(() => {
    const callback = (e) => {
      if (mouseRef.current) {
        mouseRef.current.style.top = e.clientY + "px";
        mouseRef.current.style.left = e.clientX + "px";
      }
      const mouseX = e.clientX / (window.innerWidth / 2) - 1;
      const mouseY = e.clientY / (window.innerHeight / 2) - 1;
      if (currentZoom === ZoomLevels.Zoom && !viewingAbout) {
        if (mouseX > 0.7 && mouseY < 0.3 && mouseY > -0.3) {
          setIcon(Icons.CursorRight);
        } else if (mouseX < -0.7 && mouseY < 0.3 && mouseY > -0.3) {
          setIcon(Icons.CursorLeft);
        } else if (
          (Math.abs(mouseX) < 0.7 && Math.abs(mouseX) > 0.6) ||
          mouseY >= 0.3 ||
          mouseY <= -0.3
        ) {
          setIcon(Icons.CursorDefault);
        }
      } else {
        setIcon(Icons.CursorDefault);
      }
    };
    window.addEventListener("mousemove", callback);

    return () => {
      window.removeEventListener("mousemove", callback);
    };
  }, [currentZoom, viewingAbout, setIcon]);

  const { size, rectSize, rx } = useSpring({
    size: icon === Icons.CursorDefault ? 16 : 64,
    rectSize: icon === Icons.CursorDefault ? 15 : 63,
    rx: icon === Icons.CursorDefault ? 7.5 : 31.5,
  });
  const iconHandler = (icon: Icons) => {
    switch (icon) {
      case Icons.CursorZoom:
        return "M39.5858 23H33.6667V21H43V30.3333H41V24.4142L34.3738 31.0404L32.9596 29.6262L39.5858 23ZM31.0404 34.3738L24.4142 41H30.3333V43H21L21 33.6667L23 33.6667L23 39.5858L29.6262 32.9596L31.0404 34.3738Z";
      case Icons.CursorLeft:
        return "M39.0711 31.0001L27.3432 31.0001L32.6646 25.6788L31.2504 24.2645L23.5148 32.0001L31.2504 39.7357L32.6646 38.3215L27.3432 33.0001L39.0711 33.0001L39.0711 31.0001Z";
      case Icons.CursorRight:
        return "M24.9289 32.9999L36.6568 32.9999L31.3354 38.3212L32.7496 39.7355L40.4852 31.9999L32.7496 24.2643L31.3354 25.6785L36.6568 30.9999H24.9289L24.9289 32.9999Z";
      case Icons.CursorDefault:
      default:
        return "";
    }
  };
  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: Number.MAX_SAFE_INTEGER,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
      display={isDrawerOpen ? "none" : "inherit"}
      ref={mouseRef}
    >
      <a.svg
        width={size as any}
        height={size as any}
        viewBox={size.to((i) => `0 0 ${i} ${i}`)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <a.rect
          x="0.5"
          y="0.5"
          width={rectSize}
          height={rectSize}
          rx={rx}
          fill="white"
        />
        <a.path
          fillRule="evenodd"
          clipRule="evenodd"
          d={iconHandler(icon)}
          fill="black"
        />
        <a.rect
          x="0.5"
          y="0.5"
          width={rectSize}
          height={rectSize}
          rx={rx}
          stroke="black"
        />
      </a.svg>
    </Box>
  );
};
