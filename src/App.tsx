import { LazyMotion, domAnimation } from "framer-motion";
import { CustomCursor } from "./shared/components/cursor/CustomCursor";
import { Navbar } from "./shared/components/ui/Navbar";
import { HeroSection } from "./features/hero/HeroSection";
import { AboutSection } from "./features/about/AboutSection";
import { ProjectsSection } from "./features/projects/ProjectsSection";
import { SkillsSection } from "./features/skills/SkillsSection";
import { GitHubSection } from "./features/github/GitHubSection";
import { ContactSection } from "./features/contact/ContactSection";
import { Footer } from "./shared/components/ui/Footer";

function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="aurora-bg min-h-screen cursor-none">
        <CustomCursor />
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
