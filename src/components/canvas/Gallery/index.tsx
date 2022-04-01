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
import { clamp } from "lodash";
import { GetNftMetadataResponse } from "@alch/alchemy-web3";
const generateZoomBounds = ({ width, height, viewport }) => {
  let scale2 = [0, 0];
  const resize1 =
    ((width / window.innerWidth) * viewport.width) /
    (height / window.innerHeight);
  const resize2 =
    ((height / window.innerHeight) * viewport.height) /
    (width / window.innerWidth);
  const scenario1 = [
    (resize1 * 1.25) / 2 - viewport.width / 2,
    (viewport.height * 1.25 - viewport.height) / 2,
  ];
  const scenario2 = [
    (viewport.width * 1.25 - viewport.width) / 2,
    (resize2 * 1.25) / 2 - viewport.height / 2,
  ];
  if (width > height || viewport.height > viewport.width) {
    scale2 = scenario1;
  } else {
    scale2 = scenario2;
  }
  return scale2;
};
interface IGalleryItems {
  nftData: GetNftMetadataResponse[];
}
const GalleryItems: FC<IGalleryItems> = ({ nftData }) => {
  const {
    distanceBtwnAssets,
    currentZoom,
    galleryItemIdx,
    setGalleryLength,
    viewingAbout,
    zoomOut,
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
    }),
    shallow
  );

  nftData = nftData?.length > 20 ? nftData.slice(0, 20) : nftData;
  const items = nftData.map((i) => i.media[0].gateway);
  const textures = useLoader(THREE.TextureLoader, items);
  useEffect(() => {
    setGalleryLength(items.length);
  }, [items.length, setGalleryLength]);

  useFrame(({ camera, viewport }, delta) => {
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
        3,
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
    onDrag: ({ dragging, first, last, movement: [mx, my], velocity }) => {
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
    onWheel: ({ wheeling, movement: [_mx, my], direction: [_xDir, yDir] }) => {
      if (wheeling && my > 100 && currentZoom === ZoomLevels.Zoom) {
        const dir = yDir;
        if (dir === 1) {
          zoomOut();
        }
      }
    },
  });
  const { viewport } = useThree();
  useEffect(() => {
    if (currentZoom === ZoomLevels.MaxZoom) {
      maxZoomSpring.set({
        cameraPositionY: 0,
        cameraPositionX: galleryItemIdx * distanceBtwnAssets,
      });
    }
  }, [currentZoom, distanceBtwnAssets, galleryItemIdx, maxZoomSpring]);

  useEffect(() => {
    if (currentZoom === ZoomLevels.Zoom) {
      camera.position.x = galleryItemIdx * distanceBtwnAssets;
    }
  }, [currentZoom, distanceBtwnAssets]);

  return (
    /* @ts-ignore */
    <a.group {...bind()}>
      {textures.map((i, idx) => {
        return <ImageItem isTouch={touch} key={idx} texture={i} idx={idx} />;
      })}
    </a.group>
  );
};

export default GalleryItems;
