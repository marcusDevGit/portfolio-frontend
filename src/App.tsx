import { useThemeStore } from "./shared/stores/useThemeStore";
import { Toaster } from "sonner";
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
import { Footer } from "./shared/components/ui/Footer";
import { useEffect } from "react";

function App() {
  const theme = useThemeStore((state) => state.theme);
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  return (
    <LazyMotion features={domAnimation} strict>
      <SEO />
      <Toaster theme="dark" position="top-right" />
      <div className="aurora-bg min-h-screen cursor-none">
        <CustomCursor />
        <CommandPalette />
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
