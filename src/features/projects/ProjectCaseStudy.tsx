import { useEffect } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence } from "framer-motion";
import type { Project } from "./ProjectsSection";
import { useCursorStore } from "../../shared/stores/useCursorStore";
import { ExpandableText } from "./ExpandableText";

interface ModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectCaseStudyModal({
  project,
  isOpen,
  onClose,
}: ModalProps) {
  const setHovering = useCursorStore((state) => state.setHovering);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!project) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-[rgba(11,16,32,0.95)] border border-(--border-subtle) rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-start justify-between p-6 border-b border-(--border-subtle)">
              <div>
                <h2 className="text-2xl font-bold text-(--text-primary) mb-2 font-display">
                  {project.title}
                </h2>
                <div className="flex  flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className=" text-[10px] font-mono text-(--accent-cyan) bg-(--accent-cyan)/10 px-2 py-1 rounded border border-(--accent-cyan)/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={onClose}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className="p-2 text-zinc-400 hover:text-(--text-primary) hover:bg-white/10 rounded-b-full transition-colors"
                aria-label="Fechar Modal"
              >
                <svg
                  className="w-5 h-5 text-zinc-400 group-hover:text-(--text-primary) transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto font-body text-zinc-300 space-y-8 scroll-smooth custom-scrollbar">
              {project.problem && (
                <section>
                  <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">
                    O Problema
                  </h3>
                  <ExpandableText text={project.problem} />
                </section>
              )}
              {project.solution && (
                <section>
                  <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">
                    A Solução
                  </h3>
                  <ExpandableText text={project.solution} />
                </section>
              )}
              {project.technicalDecisions && (
                <section>
                  <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">
                    Arquitetura & Decisões Técnicas
                  </h3>
                  <ExpandableText text={project.technicalDecisions} />
                </section>
              )}
              {project.challenges && (
                <section>
                  <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">
                    Desafios Superados
                  </h3>
                  <ExpandableText text={project.challenges} />
                </section>
              )}
              {project.impact && (
                <section>
                  <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">
                    Impacto Final
                  </h3>
                  <ExpandableText text={project.impact} />
                </section>
              )}
            </div>
            {/* Footer Fixo */}
            <div className="p-6 border-t border-(--border-subtle) flex flex-col sm:flex-row gap-4 bg-(--bg-card)">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  className="flex-1 bg-(--accent-cyan) text-[#050816] border border-(--accent-cyan) text-center font-bold py-3 rounded-lg hover:bg-(--accent-cyan) hover:text-black transition-all"
                >
                  Ver Aplicação Ao Vivo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  className="flex-1 bg-(--text-primary) text-(--bg-base) text-center font-bold py-3 rounded-lg hover:opacity-80 border border-(--border-subtle) transition-all"
                >
                  Acessar Código-Fonte
                </a>
              )}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
  return createPortal(modalContent, document.body);
}
