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
    (((width / window.innerWidth) * viewport.width) /
      (height / window.innerHeight)) *
      1.1,
    viewport.height * 1.1,
    1,
  ];
  const scenario2 = [
    viewport.width * 1.1,
    (((height / window.innerHeight) * viewport.height) /
      (width / window.innerWidth)) *
      1.1,
    1,
  ];
  if (viewport.height > viewport.width) {
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
    shouldZoomIn,
    setGalleryItemIdx,
    setProgressValue,
    setShouldZoomIn,
    setShowBar,
    zoomIn,
    zoomOut,
  } = galleryStore(
    (state) => ({
      distanceBtwnAssets: state.distanceBtwnAssets,
      viewingAbout: state.viewingAbout,
      maxZoom: state.maxZoom,
      currentZoom: state.currentZoom,
      galleryLength: state.galleryLength,
      galleryItemIdx: state.galleryItemIdx,
      shouldZoomIn: state.shouldZoomIn,
      setProgressValue: state.setProgressValue,
      setGalleryItemIdx: state.setGalleryItemIdx,
      setShouldZoomIn: state.setShouldZoomIn,
      setShowBar: state.setShowBar,
      zoomIn: state.zoomIn,
      zoomOut: state.zoomOut,
    }),
    shallow
  );

  const { setIcon } = mousePositionStore(
    (state) => ({
      setIcon: state.setIcon,
    }),
    shallow
  );

  let initialPosition = useMemo(
    () => [distanceBtwnAssets * idx, 0, 0],
    [distanceBtwnAssets, idx]
  );

  const mesh =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(
      null
    );

  const [{ position }, api] = useSpring(() => {
    return {
      position: initialPosition,
      config: config.default,
    };
  });

  useFrame(({}, delta) => {
    let scale: number[];
    if (currentZoom === ZoomLevels.MaxZoom && idx === galleryItemIdx) {
      scale = maxZoomHandler({ width, height, viewport });
    } else if (currentZoom === ZoomLevels.Zoom) {
      const scaleFactor = viewingAbout ? 0.5 : 0.7;
      if (viewingAbout) {
        scale = [
          window.innerWidth * 0.26,
          window.innerWidth * (height / width) * 0.26,
          ,
          1,
        ];
      } else {
        scale =
          viewport.width > viewport.height
            ? [
                (((width / window.innerWidth) * viewport.width) /
                  (height / window.innerHeight)) *
                  scaleFactor,
                viewport.height * scaleFactor,
                1,
              ]
            : [
                viewport.width * scaleFactor,
                (((height / window.innerHeight) * viewport.height) /
                  (width / window.innerWidth)) *
                  scaleFactor,
                1,
              ];
      }
    } else {
      if (width > height) {
        scale = [200, 200 * (height / width), 1];
      } else if (height > width) {
        scale = [200 * (width / height), 200, 1];
      } else {
        scale = [180, 180, 1];
      }
    }

    mesh.current.scale.x = damp(mesh.current.scale.x, scale[0], 4, delta);
    mesh.current.scale.y = damp(mesh.current.scale.y, scale[1], 4, delta);
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
      } else {
        api.start({ position: initialPosition });
      }
    }
  }, [viewingAbout, galleryItemIdx, api, idx, initialPosition]);

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
          setShowBar(true);
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
          setShouldZoomIn(true);
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
          api.set({ position: initialPosition });
        }
        setProgressValue(initialPosition[0] + -mx); //TODO: magic number fix
        if (first) {
          isDragging.current = true;
        }
        if (last) {
          requestAnimationFrame(() => (isDragging.current = false));
        }
      },
      onClick: ({ event }) => {
        if (isDragging.current) return;
        if (
          !viewingAbout &&
          (Math.abs(galleryItemIdx * distanceBtwnAssets - camera.position.x) <
            100 ||
            currentZoom !== ZoomLevels.Zoom)
        ) {
          if (currentZoom == ZoomLevels.MaxZoom) {
            zoomOut();
            setShouldZoomIn(false);
          } else if (currentZoom == ZoomLevels.NoZoom) {
            zoomIn();
            setGalleryItemIdx(idx);
            setShouldZoomIn(true);
          } else {
            if (idx === galleryItemIdx) {
              if (shouldZoomIn) {
                zoomIn();
              } else {
                zoomOut();
              }
            }
          }
        }
      },
    },
    { drag: { delay: 500 } }
  );

  const { width, height } = texture.image;

  const { viewport, camera } = useThree();

  const { opacity } = useSpring({
    opacity:
      currentZoom !== ZoomLevels.NoZoom && idx !== galleryItemIdx ? 0 : 1,
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
    </>
  );
};
