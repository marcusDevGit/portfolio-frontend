import { create } from "zustand";

export interface LogLine {
    type: "input" | "output";
    text: string;
}

interface TerminalState {
    isOpen: boolean;
    history: LogLine[];
    open: () => void;
    close: () => void;
    toggle: () => void;
    setHistory: (history: LogLine[]) => void;
    addHistoryLine: (line: LogLine) => void;
    clearHistory: () => void;

}

const initialHistory: LogLine[] = [
    { type: "output", text: "MarcusOs v1.0 - Terminal Interativo" },
    { type: "output", text: "Digite 'help' para ver os comandos disponíveis." },
]

export const useTerminalStore = create<TerminalState>((set) => ({
    isOpen: false,
    history: initialHistory,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    setHistory: (history) => set({ history }),
    addHistoryLine: (line) => set((state) => ({ history: [...state.history, line] })),
    clearHistory: () => set({ history: initialHistory })
}))