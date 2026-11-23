import { useState, useEffect, useMemo } from "react";
import { ScrollReveal } from "../../shared/components/motion/ScrollReveal";
import { useCursorStore } from "../../shared/stores/useCursorStore";
import { ProjectCaseStudyModal } from "./ProjectCaseStudy";
import { FolderGit2, Search, X } from "lucide-react";
export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl?: string;
  featured: boolean;
  order: number;
  problem?: string;
  solution?: string;
  technicalDecisions?: string;
  challenges?: string;
  impact?: string;
};
type FetchStatus = "idle" | "loading" | "success" | "error";

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTech, setSelectedTech] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const apiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
    fetch(`${apiUrl}/api/projects`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Falha ao carregar projetos");
        const json = await res.json();
        setProjects(json.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  const availableTechs = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((project) => {
      project.techStack.forEach((tech) => {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      });
    });

    const topTechs = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([tech]) => tech);

    return ["Todos", ...topTechs];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesTech =
        selectedTech === "Todos" ||
        project.techStack.some(
          (tech) => tech.toLowerCase() === selectedTech.toLowerCase(),
        );

      const matchesQuery =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.techStack.some((tech) => tech.toLowerCase().includes(query));

      return matchesTech && matchesQuery;
    });
  }, [projects, selectedTech, searchQuery]);

  return (
    <section
      id="projects"
      className="relative z-10 py-16 md:py-24 px-4 sm:px-6"
    >
      <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-display uppercase tracking-widest text-(--accent-cyan) mb-4 block">
              Portfólio
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-(--text-primary) mb-4">
              Projetos em destaque
            </h2>
            <p className="font-body text-(--text-secondary) max-w-xl mx-auto">
              Seleção dos projetos que melhor representam minha evolução como
              desenvolvedor
            </p>
          </div>

          {status === "loading" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-(--bg-card) border border-(--border-subtle) rounded-2xl p-6 animate-pulse h-48"
                />
              ))}
            </div>
          )}
          {status === "error" && (
            <p className="text-center text-(--text-muted) font-body text-sm">
              Não foi possível carregar os projetos no momento.
            </p>
          )}
          {status === "success" && (
            <>
              <div className="mb-10 flex flex-col gap-4 items-center">
                {/* Campo de busca */}
                <div className="relative w-full max-w-md">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por projeto ou tecnologia..."
                    aria-label="Buscar projetos"
                    className="
                      w-full bg-(--bg-card) border border-(--border-subtle) rounded-xl
                      pl-10 pr-9 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted)
                      focus:outline-none focus:border-(--accent-cyan)/50 transition-colors
                    "
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Limpar busca"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Chips de tecnologia */}
                <div
                  className="flex flex-wrap items-center justify-center gap-2"
                  role="group"
                  aria-label="Filtrar projetos por tecnologia"
                >
                  {availableTechs.map((tech) => {
                    const isActive = selectedTech === tech;
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => setSelectedTech(tech)}
                        aria-pressed={isActive}
                        className={`
                          px-3.5 py-1.5 rounded-full text-xs font-display tracking-wide transition-all duration-200 cursor-pointer border
                          ${
                            isActive
                              ? "bg-(--accent-cyan) text-neutral-950 border-(--accent-cyan) font-semibold shadow-[0_0_16px_rgba(0,209,255,0.25)]"
                              : "bg-(--bg-card) text-(--text-secondary) border-(--border-subtle) hover:border-(--accent-cyan)/40 hover:text-(--text-primary)"
                          }
                        `}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 bg-(--bg-card) border border-(--border-subtle) rounded-2xl">
                  <p className="text-sm text-(--text-secondary) font-body mb-3">
                    Nenhum projeto encontrado para os filtros selecionados.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTech("Todos");
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-display uppercase tracking-widest border border-(--border-subtle) text-(--accent-cyan) hover:border-(--accent-cyan)/50 transition-colors cursor-pointer"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onSelect={() => setSelectedProject(project)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollReveal>
      <ProjectCaseStudyModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
function ProjectCard({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: () => void;
}) {
  const setHovering = useCursorStore((state) => state.setHovering);
  const [isStackVisible, setIsStackVisible] = useState(false);
  return (
    <article
      className="
        group relative flex flex-col
        bg-(--bg-card) backdrop-blur-md
        border border-(--border-subtle) rounded-2xl p-6
        hover:border-(--accent-cyan)/30
        transition-all duration-300
      "
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Banner do Projeto */}
      {project.imageUrl ? (
        <div className="relative w-full aspect-video overflow-hidden rounded-xl mb-4 border border-(--border-subtle) bg-neutral-950">
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="relative w-full aspect-video overflow-hidden rounded-xl mb-4 border border-(--border-subtle) bg-neutral-900/10 flex items-center justify-center">
          <FolderGit2
            size={32}
            className="text-neutral-700 group-hover:text-(--accent-cyan)/50 transition-colors duration-300"
          />
        </div>
      )}

      {project.featured && (
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-(--accent-cyan)/5 to-transparent pointer-events-none" />
      )}

      <h3 className="font-display font-semibold text-lg text-(--text-primary) mb-3 group-hover:text-(--accent-cyan) transition-colors duration-200">
        {project.title}
      </h3>
      <p className="font-body text-sm text-(--text-secondary) leading-relaxed mb-4 flex-1">
        {project.description}
      </p>
      <div
        className={`flex flex-wrap gap-2 mb-3 ${isStackVisible ? "flex" : "hidden"} md:flex`}
      >
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="text-[10px] font-mono uppercase tracking-wider text-(--text-muted) px-2 py-1 rounded border border-(--border-subtle)"
          >
            {tech}
          </span>
        ))}
      </div>
      <button
        onClick={() => setIsStackVisible((prev) => !prev)}
        className="md:hidden mb-4 text-[10px] font-display uppercase tracking-widest text-(--text-muted) hover:text-(--accent-cyan) transition-colors duration-200 text-left"
      >
        {isStackVisible ? "Ocultar stack ↑" : "Ver stack ↓"}
      </button>

      <div className="flex items-center gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold uppercase tracking-widest text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-200"
          >
            GitHub →
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold uppercase tracking-widest text-(--accent-cyan) hover:text-(--text-primary) transition-colors duration-200"
          >
            Demo →
          </a>
        )}
        <button
          onClick={onSelect}
          className="ml-auto text-[10px] sm:text-xs font-display font-semibold uppercase tracking-widest text-(--text-primary) bg-white/10 border border-(--border-subtle) hover:bg-white/20 px-3 py-1.5 rounded transition-all duration-300"
        >
          Ler Case Study
        </button>
      </div>
    </article>
  );
}
