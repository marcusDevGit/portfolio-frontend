// src/shared/components/admin/ProfileTab.tsx
import React, { useState } from "react";
import {
  AlertTriangle,
  Phone,
  FileText,
  User,
  Plus,
  X,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

export function ProfileTab() {
  // Estados de texto do perfil
  const [bio, setBio] = useState(
    "Desenvolvedor Full Stack apaixonado por arquitetura limpa.",
  );
  const [whatsapp, setWhatsapp] = useState("+55 11 99999-9999");

  // Estado dinâmico de Stacks (Lista de tags)
  const [stacks, setStacks] = useState<string[]>([
    "React",
    "TypeScript",
    "Node.js",
    "Prisma",
    "PostgreSQL",
    "ReactNative",
    "Tailwind",
    "Jest",
    "Vite",
    "Express",
    "JWT",
    "Git/GitHub",
    "Docker",
    "MongoDB",
    "API REST",
    "Zod",
  ]);
  const [newStack, setNewStack] = useState("");

  // Estados de Upload Simulados
  const [photoName, setPhotoName] = useState("avatar.jpg");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cvName, setCvName] = useState("curriculo.pdf");

  // Adicionar uma stack na lista
  function handleAddStack(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newStack.trim();
    if (!trimmed) return;

    if (stacks.includes(trimmed)) {
      toast.warning("Esta stack já existe na lista!");
      return;
    }

    setStacks([...stacks, trimmed]);
    setNewStack("");
    toast.success(`Stack "${trimmed}" adicionada com sucesso!`);
  }

  // Remover uma stack da lista
  function handleRemoveStack(stackToRemove: string) {
    setStacks(stacks.filter((s) => s !== stackToRemove));
    toast.info(`Stack "${stackToRemove}" removida.`);
  }

  // Simular upload de Foto de Perfil (Gera URL temporária para pré-visualização)
  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      setPhotoPreview(URL.createObjectURL(file));
      toast.success(`Foto "${file.name}" carregada localmente.`);
    }
  }

  // Simular upload de Currículo (PDF)
  function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Por favor, selecione apenas arquivos em formato PDF.");
        return;
      }
      setCvName(file.name);
      toast.success(`Currículo PDF "${file.name}" carregado localmente.`);
    }
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    // Simula salvamento
    toast.success("Simulação: Informações do perfil atualizadas localmente!", {
      description:
        "Na próxima etapa adicionaremos a persistência no banco de dados.",
      duration: 5000,
    });
  }

  return (
    <div className="space-y-6">
      {/* Alerta explicativo */}
      <div className="flex gap-4 p-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 items-start">
        <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">
            Configurações de Perfil (Conexão Mockada)
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Essas opções controlam os dados da seção "Sobre Mim" e contato. As
            gravações de arquivo e dados estão sendo manipuladas em estado local
            no React e prontas para serem conectadas ao banco de dados no
            backend na próxima etapa do projeto.
          </p>
        </div>
      </div>

      <div className="border-b border-neutral-900 pb-4">
        <h2 className="text-xl font-display font-semibold text-white">
          Editar Perfil
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Gerencie suas stacks, biografia, currículo e dados de contato.
        </p>
      </div>

      <form
        onSubmit={handleSaveProfile}
        className="space-y-6 max-w-2xl bg-neutral-900/10 border border-neutral-900 p-6 rounded-xl"
      >
        {/* WhatsApp */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
            WhatsApp para Contato
          </label>
          <div className="relative">
            <Phone
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
            />
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: +55 11 99999-9999"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50"
            />
          </div>
        </div>

        {/* Quem sou eu */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
            Biografia (Quem Sou Eu)
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Fale um pouco sobre você e sua carreira..."
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50 resize-none leading-relaxed"
          />
        </div>

        {/* Gerenciador de Stacks Interativo */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
            Minhas Stacks / Tecnologias
          </label>

          {/* Caixa de tags existentes */}
          <div className="flex flex-wrap gap-2 p-3 bg-neutral-950 border border-neutral-900 rounded-lg min-h-12 items-center">
            {stacks.map((stack) => (
              <span
                key={stack}
                className="
                  flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded
                  bg-neutral-900 text-white border border-neutral-800 select-none
                "
              >
                {stack}
                <button
                  type="button"
                  onClick={() => handleRemoveStack(stack)}
                  className="text-neutral-500 hover:text-red-400 p-0.5 rounded cursor-pointer"
                  title={`Remover ${stack}`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>

          {/* Campo para adicionar nova tag */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newStack}
              onChange={(e) => setNewStack(e.target.value)}
              placeholder="Digite uma nova stack (ex: Docker)"
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddStack(e);
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddStack}
              className="
                px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-(--accent-cyan)/30 
                rounded-lg text-sm text-neutral-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer
              "
            >
              <Plus size={14} /> Adicionar
            </button>
          </div>
        </div>

        {/* Grid de Uploads (Foto e Currículo) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Upload de Currículo */}
          <div className="border border-dashed border-neutral-800 p-5 rounded-lg flex flex-col items-center gap-2 bg-neutral-950/20 text-center">
            <FileText className="text-neutral-500" size={24} />
            <span className="text-[10px] font-display uppercase tracking-wider text-neutral-400">
              Arquivo do Currículo (PDF)
            </span>
            <span className="text-[10px] font-mono text-neutral-500 truncate max-w-full block px-2">
              {cvName}
            </span>
            <label className="mt-1 px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] uppercase font-display cursor-pointer hover:border-neutral-700 text-neutral-300">
              Upload PDF
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleCvUpload}
              />
            </label>
          </div>

          {/* Upload de Foto de Perfil */}
          <div className="border border-dashed border-neutral-800 p-5 rounded-lg flex flex-col items-center gap-2 bg-neutral-950/20 text-center">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview Avatar"
                className="h-10 w-10 rounded-full object-cover border border-(--accent-cyan)/30 shadow-[0_0_10px_rgba(0,209,255,0.2)]"
              />
            ) : (
              <User className="text-neutral-500" size={24} />
            )}
            <span className="text-[10px] font-display uppercase tracking-wider text-neutral-400">
              Foto de Perfil
            </span>
            <span className="text-[10px] font-mono text-neutral-500 truncate max-w-full block px-2">
              {photoName}
            </span>
            <label className="mt-1 px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] uppercase font-display cursor-pointer hover:border-neutral-700 text-neutral-300">
              Upload Imagem
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
        </div>

        {/* Estatísticas de Visitas */}
        <div className="border-t border-neutral-900 pt-6">
          <div className="flex items-center gap-2 text-neutral-400 mb-4">
            <BarChart3 size={16} className="text-(--accent-cyan)" />
            <span className="text-xs font-display uppercase tracking-widest text-white">
              Estatísticas do Portfólio (Simulado)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-900 text-center">
              <div className="text-2xl font-bold text-white font-mono">
                1.240
              </div>
              <div className="text-[9px] font-display uppercase text-neutral-500 tracking-wider mt-1">
                Visitas Totais
              </div>
            </div>
            <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-900 text-center">
              <div className="text-2xl font-bold text-(--accent-cyan) font-mono">
                42
              </div>
              <div className="text-[9px] font-display uppercase text-neutral-500 tracking-wider mt-1">
                Mensagens Recebidas
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="
            w-full px-6 py-3 rounded-lg bg-(--accent-cyan) text-neutral-950
            font-display font-semibold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,209,255,0.2)]
            transition-all duration-300 cursor-pointer
          "
        >
          Salvar Configurações de Perfil
        </button>
      </form>
    </div>
  );
}
