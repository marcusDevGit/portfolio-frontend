import { PROJECTS, type Project } from './projects.data'


export function ProjectsSection() {
  return (
    <section id="projects" className="relative z-10 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-display uppercase tracking-widest text-(--accent-cyan) mb-4 block">
            Portfólio
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
            Projetos em destaque
          </h2>
          <p className="font-body text-(--text-secondary) max-w-xl mx-auto">
            Seleção dos projetos que melhor representam minha evolução como
            desenvolvedor
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className="
        group relative flex flex-col
        bg-[rgba(11,16,32,0.6)] backdrop-blur-md
        border border-white/10 rounded-2xl p-6
        hover:border-(--accent-cyan)/30
        transition-all duration-300
      "
    >
      {/* Borda brilhante no hover — efeito glow sutil */}
      {project.highlight && (
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-(--accent-cyan)/5 to-transparent pointer-events-none" />
      )}
      {/* ── Título ──────────────────────────────────── */}
      <h3 className="font-display font-semibold text-lg text-white mb-3 group-hover:text-(--accent-cyan) transition-colors duration-200">
        {project.title}
      </h3>
      {/* ── Descrição ───────────────────────────────── */}
      <p className="font-body text-sm text-(--text-secondary) leading-relaxed mb-4 flex-1">
        {project.description}
      </p>
      {/* ── Stack de tecnologias ─────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="text-[10px] font-mono uppercase tracking-wider text-(--text-muted) px-2 py-1 rounded border border-white/10"
          >
            {tech}
          </span>
        ))}
      </div>
      {/* ── Links ───────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold uppercase tracking-widest text-(--text-secondary) hover:text-white transition-colors duration-200"
          >
            GitHub →
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold uppercase tracking-widest text-(--accent-cyan) hover:text-white transition-colors duration-200"
          >
            Demo →
          </a>
        )}
      </div>
    </article>
  );
}
