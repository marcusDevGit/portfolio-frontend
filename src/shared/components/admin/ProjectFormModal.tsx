// src/shared/components/amin/ProjectFormModal.tsx
import React, { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { X, Info, Globe, FolderGit2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../utils/supabase";
import type { Project } from "../../../features/projects/ProjectsSection";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: () => void;
}

export function ProjectFormModal({
  isOpen,
  onClose,
  project,
  onSave,
}: ProjectFormModalProps) {
  const token = useAuthStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);

  // Estados locais inicializados na montagem do modal
  const [title, setTitle] = useState(project ? project.title : "");
  const [description, setDescription] = useState(
    project ? project.description : "",
  );
  const [techStack, setTechStack] = useState(
    project ? project.techStack.join(", ") : "",
  );
  const [githubUrl, setGithubUrl] = useState(
    project ? project.githubUrl || "" : "",
  );
  const [demoUrl, setDemoUrl] = useState(project ? project.demoUrl || "" : "");
  const [featured, setFeatured] = useState(project ? project.featured : false);
  const [order, setOrder] = useState(project ? project.order : 0);
  // Estudo de Caso
  const [problem, setProblem] = useState(project ? project.problem || "" : "");
  const [solution, setSolution] = useState(
    project ? project.solution || "" : "",
  );
  const [technicalDecisions, setTechnicalDecisions] = useState(
    project ? project.technicalDecisions || "" : "",
  );
  const [challenges, setChallenges] = useState(
    project ? project.challenges || "" : "",
  );
  const [impact, setImpact] = useState(project ? project.impact || "" : "");

  const [imageUrl, setImageUrl] = useState(
    project ? project.imageUrl || "" : "",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    project?.imageUrl || null,
  );

  if (!isOpen) return null;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }
  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || !techStack) {
      toast.warning("Título, Descrição e Stacks são obrigatórios!");
      return;
    }

    setIsLoading(true);
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `project/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error } = await supabase.storage
          .from("portfolio")
          .upload(fileName, imageFile);

        if (error) throw new Error("Erro ao fazer upload da imagem do projeto");

        const { data: publicUrlData } = supabase.storage
          .from("portfolio")
          .getPublicUrl(fileName);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        title,
        description,
        techStack: techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        imageUrl: finalImageUrl || null,
        featured,
        order: Number(order),
        problem: problem || null,
        solution: solution || null,
        technicalDecisions: technicalDecisions || null,
        challenges: challenges || null,
        impact: impact || null,
      };

      const isEdit = !!project;
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/api/projects/${project.id}`
        : `${import.meta.env.VITE_API_URL}/api/projects`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao salvar projeto.");
      }
      toast.success(
        isEdit ? "Projeto atualizado!" : "Projeto criado com sucesso!",
      );
      onSave();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro de rede ao salvar.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Janela Modal */}
      <div
        className="
          relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl
          bg-neutral-950/90 border border-neutral-800 p-6 md:p-8
          shadow-[0_0_50px_rgba(0,209,255,0.1)] text-neutral-300 backdrop-blur-xl
        "
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/50 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-display font-semibold text-white">
            {project ? "Editar Projeto" : "Novo Projeto"}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Preencha os campos abaixo para salvar o projeto.
          </p>
        </div>
        {/* Upload do Banner do Projeto */}
        <div className="flex flex-col gap-2 p-4 rounded-xl border border-neutral-900 bg-neutral-950/40">
          <label className="text-xs font-display uppercase tracking-widest text-neutral-400 font-semibold">
            Banner / Captura de Tela do Projeto
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {imagePreview ? (
              <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Preview do projeto"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 rounded-md bg-red-950/80 border border-red-800 text-red-400 hover:text-white hover:bg-red-900 transition-colors cursor-pointer"
                  title="Remover imagem"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="w-full sm:w-48 aspect-video rounded-lg border border-dashed border-neutral-800 bg-neutral-950/50 flex flex-col items-center justify-center text-neutral-600">
                <FolderGit2 size={24} />
                <span className="text-[10px] uppercase tracking-wider mt-1 font-mono">
                  Sem Banner
                </span>
              </div>
            )}

            <div className="flex-1 flex flex-col gap-1.5 w-full">
              <input
                type="file"
                accept="image/*"
                disabled={isLoading}
                onChange={handleImageChange}
                className="
                  text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0 file:text-xs file:font-semibold
                  file:bg-neutral-900 file:text-neutral-300 hover:file:bg-neutral-800
                  file:cursor-pointer cursor-pointer w-full
                "
              />
              <p className="text-[10px] text-neutral-500">
                Recomendado: Proporção 16:9 (ex: 1280x720). Tamanho máx: 5MB.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
                Título do Projeto *
              </label>
              <input
                type="text"
                required
                disabled={isLoading}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Expense Tracker"
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
                Ordem de Exibição
              </label>
              <input
                type="number"
                disabled={isLoading}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                placeholder="Ex: 1"
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
              Descrição Curta *
            </label>
            <textarea
              required
              rows={3}
              disabled={isLoading}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resumo do projeto..."
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
              Tech Stack * (Separadas por vírgula)
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="Ex: React, TypeScript, TailwindCSS"
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
                URL do GitHub
              </label>
              <div className="relative">
                <FolderGit2
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
                />
                <input
                  type="url"
                  disabled={isLoading}
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
                URL do Demo/Deploy
              </label>
              <div className="relative">
                <Globe
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
                />
                <input
                  type="url"
                  disabled={isLoading}
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://meuprojeto.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              id="modal-featured-chk"
              type="checkbox"
              disabled={isLoading}
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-(--accent-cyan) cursor-pointer"
            />
            <label
              htmlFor="modal-featured-chk"
              className="text-xs font-display uppercase tracking-widest text-neutral-300 cursor-pointer select-none"
            >
              Destacar Projeto ( Featured )
            </label>
          </div>

          {/* Estudo de Caso */}
          <div className="border-t border-neutral-900 pt-6 space-y-4">
            <div className="flex items-center gap-2 text-neutral-400">
              <Info size={16} className="text-(--accent-cyan)" />
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white">
                Detalhamento do Estudo de Caso (Opcional)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-widest text-neutral-500">
                  O Problema
                </label>
                <textarea
                  rows={3}
                  disabled={isLoading}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Qual problema esse projeto resolve..."
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-widest text-neutral-500">
                  A Solução
                </label>
                <textarea
                  rows={3}
                  disabled={isLoading}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Como o software atua como solução..."
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50 resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display uppercase tracking-widest text-neutral-500">
                Decisões Técnicas
              </label>
              <textarea
                rows={3}
                disabled={isLoading}
                value={technicalDecisions}
                onChange={(e) => setTechnicalDecisions(e.target.value)}
                placeholder="Por que escolheu a stack, arquitetura..."
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-widest text-neutral-500">
                  Desafios Enfrentados
                </label>
                <textarea
                  rows={3}
                  disabled={isLoading}
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  placeholder="Principais gargalos de código/infra..."
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-widest text-neutral-500">
                  Impacto / Resultados
                </label>
                <textarea
                  rows={3}
                  disabled={isLoading}
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  placeholder="Métricas de performance ou ganho..."
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="
                flex-1 md:flex-none px-6 py-3 rounded-lg bg-(--accent-cyan) text-neutral-950
                font-display font-semibold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,209,255,0.2)]
                transition-all duration-300 cursor-pointer disabled:opacity-60
              "
            >
              {isLoading
                ? "Salvando..."
                : project
                  ? "Salvar Alterações"
                  : "Salvar Projeto"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-neutral-800 hover:border-neutral-700 text-xs font-display uppercase tracking-widest cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
