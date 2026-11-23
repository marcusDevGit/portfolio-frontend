import { useThemeStore } from "./shared/stores/useThemeStore";
import { Toaster, toast } from "sonner";
import { LazyMotion, domAnimation } from "framer-motion";
import { SEO } from "./shared/components/seo/SEO";
import { CustomCursor } from "./shared/components/cursor/CustomCursor";
import { CommandPalette } from "./shared/components/command/CommandPalette";
import { Navbar } from "./shared/components/ui/Navbar";
import { HeroSection } from "./features/hero/HeroSection";
import { AboutSection } from "./features/about/AboutSection";
import { ProjectsSection } from "./features/projects/ProjectsSection";
import { SkillsSection } from "./features/skills/SkillsSection";
import { GitHubSection } from "./features/github/GitHubSection";
import { ContactSection } from "./features/contact/ContactSection";
import { TerminalSection } from "./features/terminal/TerminalSection";
import { useTerminalStore } from "./shared/stores/useTerminalStore";
import { useEasterEggStore } from "./shared/stores/useEasterEggStore";
import { useKonamiCode } from "./shared/hooks/useKonamiCode";
import { MatrixRain } from "./shared/components/easter-egg/MatrixRain";
import { useAuthStore } from "./shared/stores/useAuthStore";

import { Footer } from "./shared/components/ui/Footer";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const LoginModal = lazy(() =>
  import("./shared/components/admin/LoginModal").then((m) => ({
    default: m.LoginModal,
  })),
);
const AdminDashboard = lazy(() =>
  import("./shared/components/admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  })),
);

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const theme = useThemeStore((state) => state.theme);
  const toggleTerminal = useTerminalStore((state) => state.toggle);
  const toggleMatrix = useEasterEggStore((state) => state.toggleMatrix);
  const isMatrixActive = useEasterEggStore((state) => state.isMatrixActive);
  const [isTouch] = useState(
    () =>
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0,
  );
  const prevIsMatrixActiveRef = useRef(isMatrixActive);

  // Ativa a chuva digital (Matrix) ao digitar o Konami Code
  useKonamiCode(toggleMatrix);

  useEffect(() => {
    const storageKey = "portfolio_visit_tracked";
    if (sessionStorage.getItem(storageKey)) return;

    sessionStorage.setItem(storageKey, "1");
    const apiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
    if (!apiUrl) return;

    fetch(`${apiUrl}/api/analytics/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname }),
    }).catch(() => {
      sessionStorage.removeItem(storageKey);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" && e.ctrlKey) {
        e.preventDefault();
        toggleTerminal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleTerminal]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  useEffect(() => {
    const prev = prevIsMatrixActiveRef.current;
    prevIsMatrixActiveRef.current = isMatrixActive;

    if (prev === isMatrixActive) return;

    if (isMatrixActive) {
      toast.success(
        isTouch
          ? "Modo Hacker Ativado! 🕶️"
          : "Modo Hacker Ativado! 🕶️ (Pressione ESC para sair)",
        {
          id: "matrix-toast",
          duration: 4000,
        },
      );
    } else {
      toast.info("Modo Hacker Desativado. Volte sempre!", {
        id: "matrix-toast",
        duration: 3000,
      });
    }
  }, [isMatrixActive, isTouch]);

  return (
    <LazyMotion features={domAnimation} strict>
      <SEO />
      <Toaster theme={theme} position="top-right" />
      <div
        className={`aurora-bg min-h-screen ${!isTouch ? "cursor-none" : ""}`}
      >
        <CustomCursor />
        <MatrixRain />
        <CommandPalette />
        <TerminalSection />
        <Suspense fallback={null}>
          <LoginModal />
        </Suspense>
        {isAuthenticated && (
          <Suspense
            fallback={
              <div className="fixed inset-0 z-110 flex items-center justify-center bg-neutral-950/95 text-neutral-300 text-sm font-display uppercase tracking-widest">
                Carregando painel...
              </div>
            }
          >
            <AdminDashboard />
          </Suspense>
        )}
        <Navbar />

        <main className="relative z-10 pt-32 text-center">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <GitHubSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </LazyMotion>
  );
}

export default App;
