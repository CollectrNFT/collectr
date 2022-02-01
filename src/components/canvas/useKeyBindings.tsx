import galleryStore, { ZoomLevels } from "@/stores/galleryStore";
import { clamp } from "lodash";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import shallow from "zustand/shallow";

export const useKeyBindings = () => {
  const {
    viewingAbout,
    currentZoom,
    galleryLength,
    galleryItemIdx,
    setGalleryItemIdx,
    setShouldZoomIn,
    setViewingAbout,
    zoomIn,
    zoomOut,
  } = galleryStore(
    (state) => ({
      viewingAbout: state.viewingAbout,
      maxZoom: state.maxZoom,
      currentZoom: state.currentZoom,
      galleryLength: state.galleryLength,
      galleryItemIdx: state.galleryItemIdx,
      setViewingAbout: state.setViewingAbout,
      setGalleryItemIdx: state.setGalleryItemIdx,
      setGalleryLength: state.setGalleryLength,
      setShouldZoomIn: state.setShouldZoomIn,
      zoomIn: state.zoomIn,
      zoomOut: state.zoomOut,
    }),
    shallow
  );
  // Keyboard Controls

  useHotkeys("enter", setViewingAbout, {
    enabled: currentZoom === ZoomLevels.Zoom,
  });
  useHotkeys(
    "up",
    () => {
      zoomIn();
    },
    { enabled: !viewingAbout }
  );
  useHotkeys(
    "down",
    () => {
      zoomOut();
    },
    { enabled: !viewingAbout }
  );
  const [keyDir, setKeyDir] = useState(0);
  useHotkeys(
    "right",
    () => {
      setKeyDir(1);
    },
    { enabled: currentZoom === ZoomLevels.Zoom && !viewingAbout }
  );
  useHotkeys(
    "left",
    () => {
      setKeyDir(-1);
    },
    { enabled: currentZoom === ZoomLevels.Zoom && !viewingAbout }
  );
  useHotkeys(
    "esc",
    () => {
      zoomOut();
      setShouldZoomIn(false);
    },
    { enabled: currentZoom === ZoomLevels.MaxZoom && !viewingAbout }
  );

  useEffect(() => {
    if (keyDir !== 0) {
      const clampIdx = clamp(galleryItemIdx + keyDir, 0, galleryLength - 1);
      setKeyDir(0);
      setGalleryItemIdx(clampIdx);
    }
  }, [keyDir, galleryItemIdx, galleryLength, setGalleryItemIdx]);
};
