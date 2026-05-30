// src/shared/components/admin/ProjectsTab.tsx
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
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

  async function handleMove(index: number, direction: "up" | "down") {
    const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= sortedProjects.length) return;

    const currentProject = sortedProjects[index];
    const targetProject = sortedProjects[targetIndex];

    try {
      const currentOrder = currentProject.order;
      const targetOrder = targetProject.order;

      // Inverte os valores de ordem
      const newCurrentOrder =
        targetOrder === currentOrder
          ? currentOrder + (direction === "up" ? -1 : 1)
          : targetOrder;
      const newTargetOrder = currentOrder;

      // Dispara as duas atualizações em paralelo no banco de dados
      const req1 = fetch(
        `${import.meta.env.VITE_API_URL}/api/projects/${currentProject.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: newCurrentOrder }),
        },
      );

      const req2 = fetch(
        `${import.meta.env.VITE_API_URL}/api/projects/${targetProject.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: newTargetOrder }),
        },
      );

      const [res1, res2] = await Promise.all([req1, req2]);

      if (!res1.ok || !res2.ok) {
        throw new Error("Erro ao salvar reordenação no servidor.");
      }

      toast.success("Ordem dos projetos atualizada!");
      fetchProjects();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao ordenar.";
      toast.error(message);
    }
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
              {(() => {
                const sortedProjects = [...projects].sort(
                  (a, b) => a.order - b.order,
                );
                return sortedProjects.map((proj, index) => (
                  <tr
                    key={proj.id}
                    className="border-b border-neutral-900/50 hover:bg-neutral-900/20 transition-colors"
                  >
                    {/* 1. Coluna Ordem com Setas */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-neutral-500 min-w-8">
                          {proj.order}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMove(index, "up")}
                            className="
                              p-0.5 rounded text-neutral-600 hover:text-white hover:bg-neutral-800/80
                              disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-neutral-600 
                              transition-colors cursor-pointer
                            "
                            title="Subir prioridade"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={index === sortedProjects.length - 1}
                            onClick={() => handleMove(index, "down")}
                            className="
                              p-0.5 rounded text-neutral-600 hover:text-white hover:bg-neutral-800/80
                              disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-neutral-600 
                              transition-colors cursor-pointer
                            "
                            title="Descer prioridade"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </div>
                    </td>
                    {/* 2. Coluna Título */}
                    <td className="p-4 font-semibold text-white">
                      {proj.title}
                    </td>
                    {/* 3. Coluna Stack */}
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
                    {/* 4. Coluna Destaque */}
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
                    {/* 5. Coluna Ações (Editar / Deletar) */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditProject(proj)}
                          className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal do Formulário (Pai controla abertura e qual projeto será editado) */}
      <ProjectFormModal
        key={selectedProject?.id || "new"}
        isOpen={isFormOpen}
        project={selectedProject}
        onClose={() => setIsFormOpen(false)}
        onSave={fetchProjects}
      />
    </div>
  );
}
