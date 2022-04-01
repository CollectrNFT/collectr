import { Html } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Box, useMediaQuery, Text } from "@chakra-ui/react";
import galleryStore, { ZoomLevels } from "@/stores/galleryStore";
import shallow from "zustand/shallow";
import { clamp } from "lodash";
import { useGesture } from "@use-gesture/react";
import { a, useSpring } from "@react-spring/three";
import { useKeyBindings } from "../useKeyBindings";
import { GetNftMetadataResponse } from "@alch/alchemy-web3";
import Loader from "@/components/Loader";
const GalleryItems = lazy(() => import("@/components/canvas/Gallery")); // has imports from three/jsm

const Render = ({ nftData }) => {
  const [isTouch] = useMediaQuery("(hover: none), (pointer: coarse)");

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
        zoomOut: state.zoomOut,
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
      distanceBtwn: distanceBtwnAssets,
    };
  });
  const cameraGestureCameraPositionRef = useRef({
    x: camera.position.x,
  });
  const [wheelFlag, setWheelFlag] = useState(false);
  const bind = useGesture(
    {
      onDrag: ({ active, movement: [mx], velocity, first, last }) => {
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
              cameraPositionX: camera.position.x - mx,
              config: { decay: false, velocity: velocity },
            }));
          }
        }
      },
      onWheel: ({ wheeling, velocity, movement: [mx, my] }) => {
        let deltaM = 0;
        if (Math.abs(mx) > Math.abs(my)) {
          deltaM = mx;
        } else {
          deltaM = my;
        }
        if (
          camera.position.x + deltaM >= 0 &&
          camera.position.x + deltaM <= (galleryLength - 1) * distanceBtwnAssets
        ) {
          if (wheeling) {
            noZoomSpring.start(() => ({
              cameraPositionX: camera.position.x + deltaM,
              config: { decay: false, velocity: velocity },
            }));
          }
        }
      },
    },
    { wheel: { enabled: currentZoom === ZoomLevels.NoZoom && wheelFlag } }
  );

  useEffect(() => {
    if (currentZoom !== ZoomLevels.NoZoom) {
      setWheelFlag(false);
    } else {
      setTimeout(() => {
        setWheelFlag(true);
      }, 1000);
    }
  }, [currentZoom]);
  useEffect(() => {
    if (currentZoom === ZoomLevels.NoZoom) {
      noZoomSpring.start({
        cameraPositionX: galleryItemIdx * distanceBtwnAssets,
      });
    }
  }, [currentZoom, galleryItemIdx, distanceBtwnAssets, noZoomSpring]);

  const meshRef = useRef(null);
  return (
    <Suspense fallback={<Html style={{ width: "400px" }}></Html>}>
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
      <GalleryItems nftData={nftData} />
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
    setIsEndGallery,
    isEndGallery,
  } = galleryStore(
    (state) => ({
      isEndGallery: state.isEndGallery,
      setIsEndGallery: state.setIsEndGallery,
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
      if (galleryLength === galleryItemIdx + shiftDir) {
        setIsEndGallery(true);
      } else {
        setIsEndGallery(false);
      }
      const clampIdx = clamp(galleryItemIdx + shiftDir, 0, galleryLength - 1);
      setShiftDir(0);
      if (!isEndGallery) {
        setGalleryItemIdx(clampIdx);
      }
    }
  }, [shiftDir, setGalleryItemIdx, galleryItemIdx, galleryLength]);

  return (
    <Box
      sx={{ position: "fixed", top: "0", left: "0", right: "0", bottom: "0" }}
      onMouseDown={(e) => {
        if (currentZoom === ZoomLevels.Zoom && !viewingAbout) {
          const mouseX = e.clientX / (window.innerWidth / 2) - 1;
          const mouseY = e.clientY / (window.innerHeight / 2) - 1;

          if (mouseX > 0.5 && mouseY < 0.75 && mouseY > -0.75) {
            setShiftDir(1);
          } else if (mouseX < -0.5 && mouseY < 0.75 && mouseY > -0.75) {
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
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          userSelect: "none",
          transform: "translateZ(0)",
        }}
      >
        {children}
      </Canvas>
    </Box>
  );
};

export const Renderer = React.memo(
  ({ nftData }: { nftData: GetNftMetadataResponse[] }) => {
    return (
      <CanvasComponent>
        <Render nftData={nftData} />
      </CanvasComponent>
    );
  }
);
