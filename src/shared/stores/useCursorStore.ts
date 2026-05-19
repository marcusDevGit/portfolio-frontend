import { create } from "zustand";

type CursorState = {
    isHovering: boolean;
    setHovering: (value: boolean) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
    isHovering: false,
    setHovering: (value) => set({ isHovering: value }),
}));