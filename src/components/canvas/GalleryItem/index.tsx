import { damp } from "@/common/utils";
import { useFrame, useThree } from "@react-three/fiber";
import { FC, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGesture } from "@use-gesture/react";
import { a, config, useSpring } from "@react-spring/three";
import { clamp } from "lodash";
import galleryStore, { ZoomLevels } from "../../../stores/galleryStore";
import shallow from "zustand/shallow";
import { ClampToEdgeWrapping } from "three";
import mousePositionStore, { Icons } from "@/stores/mousePositionStore";

interface IImageItem {
  isTouch: boolean;
  texture: THREE.Texture;
  idx: number;
}

/**
 * Fn scales an image so that it takes up the entire viewport * 1.1
 */

const maxZoomHandler = ({ width, height, viewport }) => {
  let scale2 = [0, 0, 0];
  const scenario1 = [
    ((width / window.innerWidth) * viewport.width * 1.25) /
      (height / window.innerHeight),
    viewport.height * 1.25,
    1,
  ];
  const scenario2 = [
    viewport.width * 1.25,
    ((height / window.innerHeight) * viewport.height * 1.25) /
      (width / window.innerWidth),
    1,
  ];
  if (width > height || viewport.height > viewport.width) {
    scale2 = scenario1;
  } else {
    scale2 = scenario2;
  }
  return scale2;
};

export const ImageItem: FC<IImageItem> = ({ isTouch, texture, idx }) => {
  useMemo(() => {
    texture.generateMipmaps = false;
    texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  }, [texture]);

  // State
  const {
    distanceBtwnAssets,
    viewingAbout,
    currentZoom,
    galleryItemIdx,
    galleryLength,
    setGalleryItemIdx,
    setProgressValue,
    setShowBar,
    zoomIn,
    zoomOut,
    isEndGallery,
  } = galleryStore(
    (state) => ({
      isEndGallery: state.isEndGallery,
      distanceBtwnAssets: state.distanceBtwnAssets,
      viewingAbout: state.viewingAbout,
      maxZoom: state.maxZoom,
      currentZoom: state.currentZoom,
      galleryLength: state.galleryLength,
      galleryItemIdx: state.galleryItemIdx,
      setProgressValue: state.setProgressValue,
      setGalleryItemIdx: state.setGalleryItemIdx,
      setShowBar: state.setShowBar,
      zoomIn: state.zoomIn,
      zoomOut: state.zoomOut,
    }),
    shallow
  );
  const { width, height } = texture.image;

  const { viewport, camera } = useThree();

  const { setIcon } = mousePositionStore(
    (state) => ({
      setIcon: state.setIcon,
    }),
    shallow
  );

  const mesh =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(
      null
    );

  let initialPosition = useMemo(
    () => [distanceBtwnAssets * idx, 0, 0],
    [distanceBtwnAssets, idx]
  );
  const [{ position }, api] = useSpring(() => {
    return {
      position: initialPosition,
      config: config.default,
    };
  });

  useFrame(({}, delta) => {
    let scale: number[];
    let lambda = 3;
    if (currentZoom === ZoomLevels.MaxZoom && idx === galleryItemIdx) {
      lambda = 3;
      scale = maxZoomHandler({ width, height, viewport });
    } else if (currentZoom === ZoomLevels.Zoom) {
      let scaleFactor = viewingAbout ? 0.5 : 0.7;
      if (viewingAbout) {
        scale = [
          window.innerWidth * 0.26,
          window.innerWidth * (height / width) * 0.26,
          ,
          1,
        ];
      } else {
        if (viewport.width > viewport.height) {
          if (width / height > viewport.width / viewport.height) {
            scaleFactor = height / width;
          }
          scale = [
            (((width / window.innerWidth) * viewport.width) /
              (height / window.innerHeight)) *
              scaleFactor,
            viewport.height * scaleFactor,
            1,
          ];
        } else {
          if (height / width > viewport.height / viewport.width) {
            scaleFactor = 0.5;
          }
          scale = [
            viewport.width * scaleFactor,
            (((height / window.innerHeight) * viewport.height) /
              (width / window.innerWidth)) *
              scaleFactor,
            1,
          ];
        }
      }
    } else {
      lambda = 3;
      let size = 200;
      if (window.innerWidth >= 600) {
        if (width > height) {
          scale = [size, size * (height / width), 1];
        } else if (height > width) {
          scale = [size * (width / height), size, 1];
        } else {
          scale = [size * 0.9, size * 0.9, 1];
        }
      } else if (window.innerWidth < 600 && window.innerWidth >= 400) {
        size = 150;
        if (width > height) {
          scale = [size, size * (height / width), 1];
        } else if (height > width) {
          scale = [size * (width / height), size, 1];
        } else {
          scale = [size * 0.9, size * 0.9, 1];
        }
      } else {
        size = 150;
        if (width > height) {
          scale = [size, size * (height / width), 1];
        } else if (height > width) {
          scale = [size * (width / height), size, 1];
        } else {
          scale = [size * 0.9, size * 0.9, 1];
        }
      }
    }

    mesh.current.scale.x = damp(mesh.current.scale.x, scale[0], lambda, delta);
    mesh.current.scale.y = damp(mesh.current.scale.y, scale[1], lambda, delta);
  });

  //  Shifts Item to the right when in viewing mode
  useEffect(() => {
    if (galleryItemIdx === idx) {
      if (viewingAbout) {
        api.start({
          position: [
            initialPosition[0] + window.innerWidth * 0.18,
            initialPosition[1],
            initialPosition[2],
          ],
        });
      } else if (isEndGallery) {
        api.start({
          position: [
            initialPosition[0] - window.innerWidth * 0.5,
            initialPosition[1],
            initialPosition[2],
          ],
        });
      } else {
        api.start({ position: initialPosition });
      }
    }
  }, [viewingAbout, galleryItemIdx, api, idx, initialPosition, isEndGallery]);

  const isDragging = useRef(null);

  //   Drag Handler
  const bind = useGesture(
    {
      onDrag: ({
        active,
        movement: [mx, my],
        direction: [xDir, yDir],
        first,
        last,
        cancel,
      }) => {
        if (
          active &&
          idx === galleryItemIdx &&
          currentZoom === ZoomLevels.Zoom
        ) {
          setShowBar(false);
        } else {
          setShowBar(false);
        }
        // progress bar visiblity

        // Mobile handlers for zooming
        // when in zoom mode, drag to nav between items
        if (
          active &&
          Math.abs(my * 0.002) > 0.2 && //TODO: no magic numbers 0.002
          currentZoom !== ZoomLevels.MaxZoom &&
          isTouch
        ) {
          const dir = yDir;
          if (dir == -1) {
            setGalleryItemIdx(idx);
            zoomIn();
          } else if (dir === 1) {
            zoomOut();
          }
          cancel();
        }

        // when in zoom mode, drag to nav between items
        if (
          active &&
          Math.abs(mx * 0.002) > 0.2 && //TODO: no magic numbers 0.002
          currentZoom === ZoomLevels.Zoom &&
          idx == galleryItemIdx
        ) {
          const dir = xDir > 0 ? -1 : 1;
          const clampIdx = clamp(galleryItemIdx + dir, 0, galleryLength - 1);
          setGalleryItemIdx(clampIdx);
          cancel();
        }

        if (active && currentZoom === ZoomLevels.Zoom) {
          api.start({
            position: [
              initialPosition[0] + mx,
              isTouch ? initialPosition[1] - 0.05 * my : initialPosition[1],
              initialPosition[2],
            ],
          });
        } else if (!active && currentZoom === ZoomLevels.Zoom) {
          api.start({ position: initialPosition });
        }
        setProgressValue(initialPosition[0] + -mx);
        if (first) {
          isDragging.current = true;
        }
        if (last) {
          requestAnimationFrame(() => (isDragging.current = false));
        }
      },
      onClick: () => {
        if (isDragging.current) return;
        if (
          !viewingAbout &&
          (Math.abs(galleryItemIdx * distanceBtwnAssets - camera.position.x) <
            100 ||
            currentZoom !== ZoomLevels.Zoom)
        ) {
          if (currentZoom == ZoomLevels.MaxZoom) {
            zoomOut();
          } else if (currentZoom == ZoomLevels.NoZoom) {
            zoomIn();
            setGalleryItemIdx(idx);
          } else {
            if (idx === galleryItemIdx) {
              zoomIn();
            }
          }
        }
      },
    },
    { drag: { delay: 500 } }
  );

  const { opacity } = useSpring({
    opacity:
      idx !== galleryItemIdx && currentZoom === ZoomLevels.MaxZoom ? 0 : 1,
  });

  useEffect(() => {
    api.set({ position: initialPosition });
  }, [distanceBtwnAssets, api, initialPosition]);

  return (
    <>
      {/*@ts-ignore*/}

      <a.mesh
        {...(!viewingAbout && bind())}
        position={position as any}
        ref={mesh}
        onPointerOver={() => {
          if (currentZoom === ZoomLevels.Zoom && galleryItemIdx === idx) {
            setIcon(Icons.CursorZoom);
          }
        }}
        onPointerLeave={() => {
          if (currentZoom === ZoomLevels.Zoom && galleryItemIdx === idx) {
            setIcon(Icons.CursorDefault);
          }
        }}
      >
        <planeBufferGeometry attach="geometry" />
        <a.meshBasicMaterial
          opacity={opacity}
          transparent={true}
          map={texture}
        />
      </a.mesh>
      <a.mesh scale={[200, 200, 1]} position={position as any}>
        <planeBufferGeometry attach="geometry" />
        <a.meshBasicMaterial color="green" opacity={0} transparent={true} />
      </a.mesh>
    </>
  );
};
