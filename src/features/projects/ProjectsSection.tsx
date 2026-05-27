import { useState, useEffect } from "react";
import { ScrollReveal } from "../../shared/components/motion/ScrollReveal";
import { useCursorStore } from "../../shared/stores/useCursorStore";
import { ProjectCaseStudyModal } from "./ProjectCaseStudy";

export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  demoUrl: string | null;
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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/projects`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Falha ao carregar projetos");
        const json = await res.json();
        setProjects(json.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={() => setSelectedProject(project)}
                />
              ))}
            </div>
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
