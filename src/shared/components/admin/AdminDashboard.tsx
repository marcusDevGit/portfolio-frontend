// src/shared/components/admin/AdminDashboard.tsx
import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { LogOut, Mail, Briefcase, Settings } from "lucide-react";
import { MessagesTab } from "./MessagesTab";
import { ProjectsTab } from "./ProjectsTab";
import { ProfileTab } from "./ProfileTab";

export function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState<
    "messages" | "projects" | "settings"
  >("messages");

  return (
    <div className="fixed inset-0 z-110 flex flex-col bg-neutral-950 text-neutral-300 font-body overflow-y-auto">
      {/* Cabeçalho do Dashboard */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-neutral-950/80 sticky top-0 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-(--accent-cyan) animate-pulse" />
          <h1 className="font-display font-bold text-lg tracking-wide text-white uppercase">
            Marcus OS CMS
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-500 font-mono hidden sm:inline">
            Usuário: {user?.email}
          </span>
          <button
            onClick={logout}
            className="
              flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800
              hover:border-red-500/30 hover:text-red-400 text-xs font-display uppercase tracking-widest
              transition-all duration-300 cursor-pointer bg-neutral-900/40
            "
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      {/* Grid Principal */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Menu Lateral / Abas */}
        <aside className="w-full md:w-64 border-r border-neutral-900 p-4 space-y-2 bg-neutral-950/40">
          <button
            onClick={() => setActiveTab("messages")}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
              ${activeTab === "messages" ? "bg-(--accent-cyan) text-neutral-950 shadow-[0_0_15px_rgba(0,209,255,0.25)]" : "hover:bg-neutral-900 text-neutral-400 hover:text-white"}
            `}
          >
            <Mail size={16} /> Mensagens de Contato
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
              ${activeTab === "projects" ? "bg-(--accent-cyan) text-neutral-950 shadow-[0_0_15px_rgba(0,209,255,0.25)]" : "hover:bg-neutral-900 text-neutral-400 hover:text-white"}
            `}
          >
            <Briefcase size={16} /> Meus Projetos
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
              ${activeTab === "settings" ? "bg-(--accent-cyan) text-neutral-950 shadow-[0_0_15px_rgba(0,209,255,0.25)]" : "hover:bg-neutral-900 text-neutral-400 hover:text-white"}
            `}
          >
            <Settings size={16} /> Perfil & Configurações
          </button>
        </aside>

        {/* Área de Conteúdo das Abas */}
        <main className="flex-1 p-6 md:p-8 bg-neutral-950">
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "settings" && <ProfileTab />}
        </main>
      </div>
    </div>
  );
}
