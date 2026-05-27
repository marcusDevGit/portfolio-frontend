import { useState } from "react";
import { useCursorStore } from "../../stores/useCursorStore";
import { useThemeStore } from "../../stores/useThemeStore";
import { Sun, Moon, Menu, X } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Sobre", href: "#about" },
  { label: "Projetos", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "GitHub", href: "#github" },
  { label: "Contato", href: "#contact" },
];
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const setHovering = useCursorStore((state) => state.setHovering);
  const { theme, toggleTheme } = useThemeStore();

  function handleNavLinkClick() {
    setIsMenuOpen(false)
  }
  return (
    <header className="fixed top-0 md:top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="w-full md:w-auto px-4 md:px-6 py-3 flex items-center justify-between md:justify-start md:gap-8 bg-(--bg-card) backdrop-blur-md border-b md:border border-(--border-subtle) md:rounded-full">
        <a href="#" className="font-display font-bold text-sm tracking-widest text-(--text-primary) uppercase">
          Marcus
        </a>
        <div className="hidden md:flex items-center gap-8">
          <div className="w-px h-4 bg-(--border-subtle)/10" />
          <ul className="flex items-center gap-6 list-none">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-body text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-200"
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="w-px h-4 bg-(--border-subtle)" />
        </div>
        <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="p-2 rounded-full text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--border-subtle) transition-all duration-300 cursor-pointer"
          aria-label="Alternar Tema"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a
          href="#contact"
          className="text-xs font-display font-semibold uppercase tracking-widest px-4 py-2 rounded-full bg-(--accent-cyan) text-black hover:shadow-(--glow-cyan) transition-all duration-300"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          Hire Me
        </a>
        <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-full text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--border-subtle) transition-all duration-300 cursor-pointer"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <m.div 
          key='mobile-menu'
          initial={{ opacity: 0, y: -8}}
          animate={{ opacity: 1, y: 0}}
          exit={{opacity: 0, y: -8}}
          transition={{duration: 0.2, ease: 'easeOut'}}
          className="absolute top-full left-0 right-0 md:hidden bg-(--bg-surface)/95 backdrop-blur-xl border-b border-(--border-subtle) shadow-2xs">
            <ul className="flex flex-col list-none py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={handleNavLinkClick}
                    className="
                      block px-6 py-4
                      text-base font-body text-(--text-secondary)
                      hover:text-(--text-primary) hover:bg-(--border-subtle)
                      transition-colors duration-200
                      border-b border-(--border-dark) last:border-0
                    "
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
