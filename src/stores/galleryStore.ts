import create from "zustand";

export interface GalleryState {
  maxZoom: number;
  currentZoom: number;
  galleryLength: number | undefined;
  galleryItemIdx: number;
  shouldZoomIn: boolean;
  viewingAbout: boolean;
  showBar: boolean;
  progressValue: number;
  distanceBtwnAssets: number;
  walletAddress: string | undefined;
  zoomIn: () => void;
  zoomOut: () => void;
  setViewingAbout: () => void;
  setProgressValue: (value: number) => void;
  setShowBar: (value: boolean) => void;
  setShouldZoomIn: (value: boolean) => void;
  setGalleryLength: (galleryLength: number) => void;
  setGalleryItemIdx: (galleryItemIdx: number) => void;
  setWalletAddress: (walletAddress: string) => void;
  setDistanceBtwnAssets: (value: number) => void;
}

export enum ZoomLevels {
  NoZoom = 0,
  Zoom = 1,
  MaxZoom = 2,
}

const galleryStore = create<GalleryState>((set) => ({
  maxZoom: 2,
  currentZoom: 1,
  shouldZoomIn: true,
  galleryLength: undefined,
  galleryItemIdx: 0,
  showBar: false,
  viewingAbout: false,
  walletAddress: undefined,
  progressValue: 0,
  distanceBtwnAssets: 700,
  zoomIn: () =>
    set((state) => {
      if (state.currentZoom < state.maxZoom) {
        ++state.currentZoom;
      }
      if (state.currentZoom !== 0) {
        state.setDistanceBtwnAssets(700);
      }
    }),
  zoomOut: () =>
    set((state) => {
      if (state.currentZoom > 0) {
        --state.currentZoom;
      }
      if (state.currentZoom === 0) {
        state.setDistanceBtwnAssets(300);
      }
    }),
  setViewingAbout: () =>
    set((state) => {
      state.viewingAbout = !state.viewingAbout;
    }),
  setShouldZoomIn: (value) =>
    set((state) => {
      state.shouldZoomIn = value;
    }),
  setShowBar: (value) =>
    set((state) => {
      state.showBar = value;
    }),
  setGalleryLength: (galleryLength) =>
    set((state) => {
      state.galleryLength = galleryLength;
    }),
  setGalleryItemIdx: (galleryItemIdx) =>
    set((state) => {
      state.galleryItemIdx = galleryItemIdx;
    }),
  setProgressValue: (value) =>
    set((state) => {
      state.progressValue = value;
    }),
  setDistanceBtwnAssets: (value) =>
    set((state) => {
      state.distanceBtwnAssets = value;
    }),
  setWalletAddress: (value) =>
    set((state) => {
      state.walletAddress = value;
    }),
}));

export default galleryStore;
