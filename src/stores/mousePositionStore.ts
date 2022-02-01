import create from "zustand";

export enum Icons {
  CursorLeft = "cursorLeft",
  CursorRight = "cursorRight",
  CursorZoom = "cursorZoom",
  CursorDefault = "cursorDefault",
}

export interface MousePositionState {
  icon: Icons;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  setIcon: (icon: Icons) => void;
}

const mousePositionStore = create<MousePositionState>((set) => ({
  icon: Icons.CursorDefault,
  isDrawerOpen: false,
  setIsDrawerOpen: (isOpen: boolean) => {
    set((state) => {
      state.isDrawerOpen = isOpen;
    });
  },
  setIcon: (icon) => {
    set((state) => {
      state.icon = icon;
    });
  },
}));

export default mousePositionStore;
