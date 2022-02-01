import { damp } from "@/common/utils";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { useGesture } from "@use-gesture/react";
import { a, useSpring } from "@react-spring/three";
import galleryStore, { ZoomLevels } from "../../../stores/galleryStore";
import shallow from "zustand/shallow";
import { ImageItem } from "../GalleryItem";
import { useMediaQuery } from "@chakra-ui/react";
import { clamp, debounce } from "lodash";

const generateZoomBounds = ({ width, height, viewport }) => {
  // TODO: fix 2.5 magic number
  let scale2 = [0, 0];
  const scenario1 = [
    ((((width / window.innerWidth) * viewport.width) /
      (height / window.innerHeight)) *
      1.15) /
      2,
    (viewport.height * 0.5) / 2,
  ];
  const scenario2 = [
    (viewport.width * 0.5) / 2,
    ((((height / window.innerHeight) * viewport.height) /
      (width / window.innerWidth)) *
      1.15) /
      2,
  ];
  if (viewport.height > viewport.width) {
    scale2 = scenario1;
  } else {
    scale2 = scenario2;
  }
  return scale2;
};
const GalleryItems: FC = () => {
  const {
    distanceBtwnAssets,
    currentZoom,
    galleryItemIdx,
    setGalleryLength,
    viewingAbout,
  } = galleryStore(
    (state) => ({
      zoomIn: state.zoomIn,
      zoomOut: state.zoomOut,
      walletAddress: state.walletAddress,
      distanceBtwnAssets: state.distanceBtwnAssets,
      viewingAbout: state.viewingAbout,
      currentZoom: state.currentZoom,
      galleryLength: state.galleryLength,
      galleryItemIdx: state.galleryItemIdx,
      setGalleryLength: state.setGalleryLength,
      setDistanceBtwnAssets: state.setDistanceBtwnAssets,
      setShouldZoomIn: state.setShouldZoomIn,
    }),
    shallow
  );

  const items = [1, 2, 3, 4, 5, 6, 7].map((i) => `./images/gallery/${i}.png`);
  const textures = useLoader(THREE.TextureLoader, items);
  useEffect(() => {
    setGalleryLength(items.length);
  }, [items.length, setGalleryLength]);

  useFrame(({ camera, mouse, size, viewport }, delta) => {
    if (currentZoom === ZoomLevels.MaxZoom && !viewingAbout) {
      const [xBound, yBound] = generateZoomBounds({
        width: textures[galleryItemIdx].image.width,
        height: textures[galleryItemIdx].image.height,
        viewport,
      });

      camera.position.x = clamp(
        maxZoomStyle.cameraPositionX.toJSON(),
        galleryItemIdx * distanceBtwnAssets - xBound,
        galleryItemIdx * distanceBtwnAssets + xBound
      );
      camera.position.y = clamp(
        maxZoomStyle.cameraPositionY.toJSON(),
        -yBound,
        yBound
      );
    } else if (currentZoom == ZoomLevels.Zoom && !viewingAbout) {
      camera.position.x = damp(
        camera.position.x,
        galleryItemIdx * distanceBtwnAssets,
        4,
        delta
      );
      camera.position.y = 0;
    } else {
      camera.position.y = 0;
    }

    camera.updateProjectionMatrix();
  });

  const { camera } = useThree();
  const [touch] = useMediaQuery("(hover: none), (pointer: coarse)");

  const [maxZoomStyle, maxZoomSpring] = useSpring(() => {
    return {
      from: {
        cameraPositionX: galleryItemIdx * distanceBtwnAssets,
        cameraPositionY: 0,
      },
    };
  });

  const savedPosition = useRef({ x: camera.position.x, y: camera.position.y });
  const bind = useGesture({
    onDrag: ({
      dragging,
      initial,
      first,
      last,
      movement: [mx, my],
      velocity,
    }) => {
      if (currentZoom === ZoomLevels.MaxZoom) {
        if (first || (last && savedPosition.current)) {
          savedPosition.current.x = camera.position.x;
          savedPosition.current.y = camera.position.y;
        }

        if (dragging) {
          maxZoomSpring.start(() => ({
            cameraPositionY: savedPosition.current.y + my,
            cameraPositionX: savedPosition.current.x - mx,
            config: { decay: false, velocity: velocity },
          }));
        }
      }
    },
  });

  useEffect(() => {
    if (currentZoom === ZoomLevels.MaxZoom) {
      maxZoomSpring.set({
        cameraPositionY: 0,
        cameraPositionX: galleryItemIdx * distanceBtwnAssets,
      });
    }
  }, [currentZoom, distanceBtwnAssets, galleryItemIdx, maxZoomSpring]);
  const testRef = useRef(null);

  return (
    /* @ts-ignore */
    <a.group ref={testRef} {...bind()}>
      {textures.map((i, idx) => {
        return <ImageItem isTouch={touch} key={idx} texture={i} idx={idx} />;
      })}
    </a.group>
  );
};

export default GalleryItems;
