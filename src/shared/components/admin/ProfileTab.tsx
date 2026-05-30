// Local: frontend/src/shared/components/admin/ProfileTab.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Phone,
  FileText,
  User,
  Plus,
  X,
  BarChart3,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../stores/useAuthStore";
import { supabase } from "../../utils/supabase";

interface StatsData {
  totalVisits: number;
  totalMessages: number;
}

export function ProfileTab() {
  const token = useAuthStore((state) => state.token);

  // Estados de texto do perfil
  const [bio, setBio] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [stacks, setStacks] = useState<string[]>([]);
  const [newStack, setNewStack] = useState("");

  // Links persistidos
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  // Arquivos selecionados no input local
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Exibição visual do nome do arquivo
  const [photoName, setPhotoName] = useState("Nenhuma foto selecionada");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cvName, setCvName] = useState("Nenhum arquivo selecionado");

  // Estados para alteração de senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  // Estados de controle para exibir/ocultar senha (máscara)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Estados gerais
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);

  const api_url = import.meta.env.VITE_API_URL;

  // Busca as configurações de perfil do backend
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${api_url}/api/profile`);
      if (!res.ok) throw new Error("Erro ao carregar dados do perfil.");
      const data = await res.json();

      setBio(data.bio || "");
      setWhatsapp(data.whatsapp || "");
      setStacks(data.stacks || []);
      setAvatarUrl(data.avatarUrl || null);
      setCvUrl(data.cvUrl || null);

      if (data.avatarUrl) {
        setPhotoPreview(data.avatarUrl);
        setPhotoName("Avatar Atual");
      }
      if (data.cvUrl) {
        setCvName("Currículo Atual (PDF)");
      }
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível carregar as configurações do perfil.");
    }
  }, [api_url]);

  // Busca as estatísticas reais do backend (Rota protegida)
  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${api_url}/api/analytics/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar estatísticas.");
      const data = await res.json();
      setStats({
        totalVisits: data.totalVisits || 0,
        totalMessages: data.totalMessages || 0,
      });
    } catch (err) {
      console.error(err);
    }
  }, [api_url, token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProfile();
      fetchStats();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProfile, fetchStats]);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.warning("A nova senha deve ter no mínimo 6 caracteres!");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao atualizar a senha.");
      }

      toast.success("Senha de acesso atualizada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro de rede ao atualizar senha.";
      toast.error(message);
    } finally {
      setUpdatingPassword(false);
    }
  }

  // Adicionar stack localmente
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
  }

  // Remover stack localmente
  function handleRemoveStack(stackToRemove: string) {
    setStacks(stacks.filter((s) => s !== stackToRemove));
  }

  // Selecionar foto localmente
  function handlePhotoSelection(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPhotoName(file.name);
      setPhotoPreview(URL.createObjectURL(file));
      toast.info(`Foto selecionada: ${file.name}`);
    }
  }

  // Selecionar currículo localmente
  function handleCvSelection(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Selecione apenas arquivos PDF para o currículo.");
        return;
      }
      setCvFile(file);
      setCvName(file.name);
      toast.info(`Currículo selecionado: ${file.name}`);
    }
  }

  // Envia um arquivo para o bucket público do Supabase Storage
  async function uploadFile(
    file: File,
    folder: "avatars" | "documents",
  ): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("portfolio")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw new Error(`Erro no Supabase Storage: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("portfolio")
      .getPublicUrl(path);

    return publicUrlData.publicUrl;
  }

  // Grava tudo no backend
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let finalAvatarUrl = avatarUrl;
      let finalCvUrl = cvUrl;

      // Executa o upload físico para o Supabase se houver novo arquivo selecionado
      if (avatarFile) {
        toast.info("Enviando foto de perfil para o Supabase...");
        finalAvatarUrl = await uploadFile(avatarFile, "avatars");
      }

      if (cvFile) {
        toast.info("Enviando currículo PDF para o Supabase...");
        finalCvUrl = await uploadFile(cvFile, "documents");
      }

      // Envia as strings dos dados de texto e as URLs finais do Supabase para o backend
      const res = await fetch(`${api_url}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio,
          whatsapp,
          stacks,
          avatarUrl: finalAvatarUrl,
          cvUrl: finalCvUrl,
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || "Erro ao salvar perfil.");
      }

      toast.success("Configurações do perfil salvas com sucesso!");
      fetchProfile(); // Recarrega dados limpos
      setAvatarFile(null);
      setCvFile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 p-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 items-start">
        <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">
            Configurações de Perfil (Conexão Supabase + Backend)
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            As alterações realizadas nos dados de texto serão salvas no
            PostgreSQL. Mídias como imagem de perfil e currículo em PDF são
            carregadas diretamente no Supabase Storage.
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

        {/* Biografia */}
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

        {/* Gerenciador de Stacks */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
            Minhas Stacks / Tecnologias
          </label>

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

        {/* Grid de Uploads */}
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
            <div className="flex gap-2 mt-1">
              <label className="px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] uppercase font-display cursor-pointer hover:border-neutral-700 text-neutral-300">
                Upload PDF
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleCvSelection}
                />
              </label>
              {cvUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setCvUrl(null);
                    setCvFile(null);
                    setCvName("Nenhum arquivo selecionado");
                    toast.info(
                      "Currículo removido localmente. Clique em Salvar para persistir.",
                    );
                  }}
                  className="px-3 py-1 rounded bg-red-950/40 border border-red-900/30 text-[10px] uppercase font-display cursor-pointer hover:bg-red-900/20 text-red-400 transition-colors"
                >
                  Remover
                </button>
              )}
            </div>
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
            <div className="flex gap-2 mt-1">
              <label className="px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] uppercase font-display cursor-pointer hover:border-neutral-700 text-neutral-300">
                Upload Imagem
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelection}
                />
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarUrl(null);
                    setAvatarFile(null);
                    setPhotoPreview(null);
                    setPhotoName("Nenhuma foto selecionada");
                    toast.info(
                      "Foto removida localmente. Clique em Salvar para persistir.",
                    );
                  }}
                  className="px-3 py-1 rounded bg-red-950/40 border border-red-900/30 text-[10px] uppercase font-display cursor-pointer hover:bg-red-900/20 text-red-400 transition-colors"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="border-t border-neutral-900 pt-6">
          <div className="flex items-center gap-2 text-neutral-400 mb-4">
            <BarChart3 size={16} className="text-(--accent-cyan)" />
            <span className="text-xs font-display uppercase tracking-widest text-white">
              Estatísticas do Portfólio (Reais)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-900 text-center">
              <div className="text-2xl font-bold text-white font-mono">
                {stats ? stats.totalVisits : "..."}
              </div>
              <div className="text-[9px] font-display uppercase text-neutral-500 tracking-wider mt-1">
                Visitas Totais
              </div>
            </div>
            <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-900 text-center">
              <div className="text-2xl font-bold text-(--accent-cyan) font-mono">
                {stats ? stats.totalMessages : "..."}
              </div>
              <div className="text-[9px] font-display uppercase text-neutral-500 tracking-wider mt-1">
                Mensagens Recebidas
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full px-6 py-3 rounded-lg bg-(--accent-cyan) text-neutral-950
            font-display font-semibold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,209,255,0.2)]
            transition-all duration-300 cursor-pointer disabled:opacity-50
          "
        >
          {loading
            ? "Salvando Configurações..."
            : "Salvar Configurações de Perfil"}
        </button>
      </form>
      {/* Form de alteração de senha  */}
      <form
        onSubmit={handleChangePassword}
        className="mt-8 space-y-6 max-w-2xl bg-neutral-900/10 border border-neutral-900 p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
          <Key size={16} className="text-(--accent-cyan)" />
          <h3 className="text-xs font-display uppercase tracking-widest text-white font-semibold">
            Segurança & Alteração de Senha
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Campo: Senha Atual */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                title={showCurrentPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {/* Campo: Nova Senha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display uppercase tracking-widest text-neutral-400">
              Nova Senha
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-(--accent-cyan)/50"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                title={showNewPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={updatingPassword}
          className="
              w-full px-6 py-3 rounded-lg border border-neutral-800 hover:border-(--accent-cyan)/30
              font-display font-semibold text-xs uppercase tracking-widest text-neutral-300 hover:text-white
              transition-all duration-300 cursor-pointer disabled:opacity-50 bg-neutral-950/40
            "
        >
          {updatingPassword
            ? "Atualizando Senha..."
            : "Atualizar Senha de Acesso"}
        </button>
      </form>
    </div>
  );
}
