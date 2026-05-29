// src/shared/components/amin/MessagesTab.tsx
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function MessagesTab() {
  const token = useAuthStore((state) => state.token);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar mensagens.");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao consultar mensagens.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  async function handleMarkAsRead(id: string) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact/${id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Erro ao atualizar mensagem.");
      toast.success("Mensagem marcada como lida!");
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido.";
      toast.error(message);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchMessages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-sm font-mono text-neutral-500 animate-pulse">
          Carregando mensagens da API...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-900 pb-4">
        <h2 className="text-xl font-display font-semibold text-white">
          Mensagens Recebidas
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Lista de contatos enviados pelos visitantes do portfólio.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12 text-neutral-600 font-mono text-xs">
          Nenhuma mensagem registrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`
                p-5 rounded-xl border bg-neutral-900/30 backdrop-blur-xs flex flex-col gap-3 transition-colors duration-200
                ${msg.read ? "border-neutral-900/60" : "border-(--accent-cyan)/25 bg-neutral-900/50"}
              `}
            >
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-(--accent-cyan) animate-ping" />
                    )}
                  </div>
                  <span className="text-xs text-neutral-500">{msg.email}</span>
                </div>
                <span className="text-[10px] text-neutral-600 font-mono">
                  {new Date(msg.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>
              <p className="text-sm text-neutral-400 bg-neutral-950/40 p-4 rounded-lg border border-neutral-900/50 leading-relaxed font-body whitespace-pre-wrap">
                {msg.message}
              </p>
              {!msg.read && (
                <button
                  onClick={() => handleMarkAsRead(msg.id)}
                  className="
                    self-end flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800
                    hover:border-(--accent-cyan)/30 hover:text-white text-xs font-display uppercase tracking-widest transition-colors cursor-pointer
                  "
                >
                  <Check size={12} /> Marcar como lida
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
