// src/shared/components/admin/ProjectsTab.tsx
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProjectFormModal } from "./ProjectFormModal";
import type { Project } from "../../../features/projects/ProjectsSection";

export function ProjectsTab() {
  const token = useAuthStore((state) => state.token);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados de controle do Modal de Formulário
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
      if (!res.ok) throw new Error("Erro ao carregar projetos.");
      const json = await res.json();
      setProjects(json.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro de rede ao buscar projetos.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleDeleteProject(id: string) {
    if (!confirm("Tem certeza que deseja deletar este projeto?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/projects/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Erro ao deletar projeto.");
      toast.success("Projeto excluído com sucesso!");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro de rede ao deletar projeto.";
      toast.error(message);
    }
  }

  function handleNewProject() {
    setSelectedProject(null);
    setIsFormOpen(true);
  }

  function handleEditProject(proj: Project) {
    setSelectedProject(proj);
    setIsFormOpen(true);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProjects]);

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-sm font-mono text-neutral-500 animate-pulse">
          Carregando projetos da API...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-white">
            Gerenciar Projetos
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Crie, edite ou remova os projetos em destaque no site.
          </p>
        </div>
        <button
          onClick={handleNewProject}
          className="
            flex items-center gap-1.5 px-4 py-2 rounded-lg bg-(--accent-cyan) text-neutral-950
            font-display font-semibold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,209,255,0.2)]
            transition-all duration-300 cursor-pointer
          "
        >
          <Plus size={14} /> Novo Projeto
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-neutral-600 font-mono text-xs">
          Nenhum projeto cadastrado no banco.
        </div>
      ) : (
        <div className="overflow-x-auto border border-neutral-900 rounded-xl bg-neutral-900/10">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-900 text-neutral-500 text-xs font-display uppercase tracking-wider">
                <th className="p-4">Ordem</th>
                <th className="p-4">Título</th>
                <th className="p-4">Stack</th>
                <th className="p-4">Destaque</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {projects
                .sort((a, b) => a.order - b.order)
                .map((proj) => (
                  <tr
                    key={proj.id}
                    className="border-b border-neutral-900/50 hover:bg-neutral-900/20 transition-colors"
                  >
                    <td className="p-4 font-mono text-neutral-500">
                      {proj.order}
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {proj.title}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 font-mono"
                          >
                            {s}
                          </span>
                        ))}
                        {proj.techStack.length > 3 && (
                          <span className="text-[10px] text-neutral-600 font-mono">
                            +{proj.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {proj.featured ? (
                        <span className="text-[10px] text-(--accent-cyan) bg-(--accent-cyan)/10 border border-(--accent-cyan)/20 px-2 py-0.5 rounded-full font-display font-semibold uppercase tracking-wider">
                          Sim
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-600 font-display uppercase tracking-wider">
                          Não
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditProject(proj)}
                          className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal do Formulário (Pai controla abertura e qual projeto será editado) */}
      <ProjectFormModal
        isOpen={isFormOpen}
        project={selectedProject}
        onClose={() => setIsFormOpen(false)}
        onSave={fetchProjects}
      />
    </div>
  );
}
