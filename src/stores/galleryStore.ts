import create from "zustand";

export interface GalleryState {
  maxZoom: number;
  currentZoom: number;
  galleryLength: number | undefined;
  galleryItemIdx: number;
  viewingAbout: boolean;
  showBar: boolean;
  progressValue: number;
  distanceBtwnAssets: number;
  walletAddress: string | undefined;
  isEndGallery: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  setViewingAbout: () => void;
  setIsEndGallery: (value: boolean) => void;
  setProgressValue: (value: number) => void;
  setShowBar: (value: boolean) => void;
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
  currentZoom: 0,
  galleryLength: undefined,
  galleryItemIdx: 0,
  showBar: false,
  isEndGallery: false,
  viewingAbout: false,
  walletAddress: undefined,
  progressValue: 0,
  distanceBtwnAssets: 700,
  zoomIn: () =>
    set((state) => {
      if (state.currentZoom < state.maxZoom) {
        ++state.currentZoom;
      }
    }),
  zoomOut: () =>
    set((state) => {
      if (state.currentZoom > 0) {
        --state.currentZoom;
      }
    }),
  setIsEndGallery: (value) => {
    set((state) => {
      state.isEndGallery = value;
    });
  },
  setViewingAbout: () =>
    set((state) => {
      state.viewingAbout = !state.viewingAbout;
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
