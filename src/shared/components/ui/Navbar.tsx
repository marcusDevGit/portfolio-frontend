const NAV_LINKS = [
  { label: "Sobre", href: "#about" },
  { label: "Projetos", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "GitHub", href: "#github" },
  { label: "Contato", href: "#contact" },
];
export function Navbar() {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="rounded-full px-6 py-3 flex items-center gap-8 bg-[rgba(11,16,32,0.6)] backdrop-blur-md border border-white/10">
        <a className="font-display font-bold text-sm tracking-widest text-white uppercase">
          Marcus
        </a>
        <div className="w-px h-4 bg-white/10" />
        <ul className="flex items-center gap-6 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-body text-(--text-secondary) hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="w-px h-4 bg-white/10" />
        <a
          href="#contact"
          className="text-xs font-display font-semibold uppercase tracking-widest px-4 py-2 rounded-full bg-(--accent-cyan) text-[#050816] hover:shadow-(--glow-cyan) transition-all duration-300"
        >
          Hire Me
        </a>
      </nav>
    </header>
  );
}
