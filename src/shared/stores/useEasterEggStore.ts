import { create } from "zustand";

interface EasterEggStore {
    isMatrixActive: boolean;
    toggleMatrix: () => void;
    setMatrixActive: (active: boolean) => void
}

export const useEasterEggStore = create<EasterEggStore>((set) => ({
    isMatrixActive: false,
    toggleMatrix: () => set((state) => ({ isMatrixActive: !state.isMatrixActive })),
    setMatrixActive: (active) => set({ isMatrixActive: active })
}))
