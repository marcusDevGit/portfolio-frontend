import { create } from "zustand";

type Theme = "dark" | "light";

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const getSystemTheme = (): Theme => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-schema: light").matches) {
        return "light";
    }
    return "dark";
}

const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "dark";
    const savedTheme = localStorage.getItem("portfolio-theme") as Theme | null;
    return savedTheme || getSystemTheme();
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: getInitialTheme(),

    toggleTheme: () => set((state) => {
        const newTheme = state.theme === "dark" ? "light" : 'dark';
        localStorage.setItem("portfolio-theme", newTheme);
        return { theme: newTheme }
    }),

    setTheme: (theme) => set(() => {
        localStorage.setItem("portfolio-theme", theme);
        return { theme };
    })
}));