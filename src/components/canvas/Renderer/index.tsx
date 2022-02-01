import { Html } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Box } from "@chakra-ui/react";
import galleryStore, { ZoomLevels } from "@/stores/galleryStore";
import shallow from "zustand/shallow";
import { clamp } from "lodash";
import { useGesture } from "@use-gesture/react";
import { a, useSpring } from "@react-spring/three";
import { useKeyBindings } from "../useKeyBindings";
const GalleryItems = lazy(() => import("@/components/canvas/Gallery")); // has imports from three/jsm

const Render = () => {
  const { size, camera } = useThree();
  useFrame(() => {
    if (currentZoom === ZoomLevels.NoZoom) {
      camera.position.x = noZoomStyle.cameraPositionX.toJSON();
      meshRef.current?.position.copy(camera.position);
      meshRef.current?.quaternion.copy(camera.quaternion);
      meshRef.current?.translateZ(-5);
    }
  });
  // State
  const { distanceBtwnAssets, currentZoom, galleryLength, galleryItemIdx } =
    galleryStore(
      (state) => ({
        setShowBar: state.setShowBar,
        galleryItemIdx: state.galleryItemIdx,
        distanceBtwnAssets: state.distanceBtwnAssets,
        viewingAbout: state.viewingAbout,
        currentZoom: state.currentZoom,
        galleryLength: state.galleryLength,
      }),
      shallow
    );
  const [noZoomStyle, noZoomSpring] = useSpring(() => {
    return {
      cameraPositionX: galleryItemIdx * distanceBtwnAssets,
    };
  });
  const cameraGestureCameraPositionRef = useRef({
    x: camera.position.x,
  });
  const bind = useGesture({
    onDrag: ({ active, movement: [mx], velocity, first, last }) => {
      if (currentZoom === ZoomLevels.NoZoom) {
        if (first || last) {
          cameraGestureCameraPositionRef.current = {
            x: camera.position.x,
          };
        }
        if (
          camera.position.x - mx >= 0 &&
          camera.position.x - mx <= (galleryLength - 1) * distanceBtwnAssets
        ) {
          if (active) {
            noZoomSpring.start(() => ({
              cameraPositionX: cameraGestureCameraPositionRef.current.x - mx,
              config: { decay: false, velocity: velocity },
            }));
          }
        }
      }
    },
    onWheel: ({ event, wheeling, velocity, movement: [mx, my] }) => {
      if (currentZoom === ZoomLevels.NoZoom) {
        if (
          camera.position.x + my >= 0 &&
          camera.position.x + my <= (galleryLength - 1) * distanceBtwnAssets
        ) {
          if (wheeling) {
            noZoomSpring.start(() => ({
              cameraPositionX: camera.position.x + my,
              config: { decay: false, velocity: velocity },
            }));
          }
        }
      } else {
      }
    },
  });
  useEffect(() => {
    if (currentZoom === ZoomLevels.NoZoom) {
      noZoomSpring.set({
        cameraPositionX: galleryItemIdx * distanceBtwnAssets,
      });
    }
  }, [currentZoom, galleryItemIdx, distanceBtwnAssets, noZoomSpring]);

  const meshRef = useRef(null);
  return (
    <Suspense
      fallback={
        <Html as="div">
          <Box
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
          >
            Loading...
          </Box>
        </Html>
      }
    >
      {/* @ts-ignore */}
      <a.mesh ref={meshRef} {...bind()}>
        <planeBufferGeometry
          attach="geometry"
          args={[size.width, size.height]}
        />
        <meshPhongMaterial
          attach="material"
          color="white"
          transparent={true}
          opacity={0}
        />
      </a.mesh>
      <GalleryItems />
    </Suspense>
  );
};

const CanvasComponent = ({ children }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref) {
      ref.current.style["touch-action"] = "none";
    }
  }, [ref]);
  // Set Key Bindings
  useKeyBindings();
  const [shiftDir, setShiftDir] = useState(0);
  const {
    galleryLength,
    galleryItemIdx,
    setGalleryItemIdx,
    currentZoom,
    viewingAbout,
  } = galleryStore(
    (state) => ({
      viewingAbout: state.viewingAbout,
      currentZoom: state.currentZoom,
      galleryLength: state.galleryLength,
      galleryItemIdx: state.galleryItemIdx,
      setGalleryItemIdx: state.setGalleryItemIdx,
    }),
    shallow
  );

  useEffect(() => {
    if (shiftDir !== 0) {
      const clampIdx = clamp(galleryItemIdx + shiftDir, 0, galleryLength - 1);
      setShiftDir(0);
      setGalleryItemIdx(clampIdx);
    }
  }, [shiftDir, setGalleryItemIdx, galleryItemIdx, galleryLength]);

  return (
    <Box
      sx={{ position: "fixed", top: 0 }}
      onMouseDown={(e) => {
        if (currentZoom === ZoomLevels.Zoom && !viewingAbout) {
          const mouseX = e.clientX / (window.innerWidth / 2) - 1;
          const mouseY = e.clientY / (window.innerHeight / 2) - 1;

          if (mouseX > 0.7 && mouseY < 0.3 && mouseY > -0.3) {
            setShiftDir(1);
          } else if (mouseX < -0.7 && mouseY < 0.3 && mouseY > -0.3) {
            setShiftDir(-1);
          }
        }
      }}
    >
      <Canvas
        orthographic
        dpr={Math.max(window.devicePixelRatio, 2)}
        mode="concurrent"
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
        }}
        ref={ref}
        style={{
          position: "fixed",
          top: 0,
          userSelect: "none",
          transform: "translateZ(0)",
        }}
      >
        {children}
      </Canvas>
    </Box>
  );
};

export const Renderer = React.memo(() => {
  return (
    <CanvasComponent>
      <Render />
    </CanvasComponent>
  );
});
