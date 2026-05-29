// src/shared/components/admin/LoginModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../stores/useAuthStore";
import { X, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

export function LoginModal() {
  const isOpen = useAuthStore((state) => state.isLoginModalOpen);
  const closeModal = useAuthStore((state) => state.closeLoginModal);
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        firstInputRef.current?.focus();
        setEmail("");
        setPassword("");
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Preencha todos os campos!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "E-mail ou senha inválidos.");
      }

      toast.success("Acesso administrativo concedido!");
      login(data.token, data.user.email);
      closeModal();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro de conexão com o servidor.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
          {/* Backdrop Escuro com Blur */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Card do Formulário */}
          <m.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-md overflow-hidden rounded-2xl
              bg-neutral-950/90 border border-neutral-800
              shadow-[0_0_50px_rgba(0,209,255,0.1)] p-8
              font-body text-neutral-300 backdrop-blur-xl
            "
          >
            {/* Botão Fechar */}
            <button
              onClick={closeModal}
              className="
                absolute top-4 right-4 p-1.5 rounded-lg
                text-neutral-400 hover:text-white hover:bg-neutral-800/50
                transition-all duration-200 cursor-pointer
              "
              aria-label="Fechar Modal"
            >
              <X size={18} />
            </button>

            {/* Cabeçalho */}
            <div className="text-center mb-6">
              <span className="text-[10px] font-display uppercase tracking-widest text-(--accent-cyan) mb-2 block">
                Área Restrita
              </span>
              <h3 className="font-display font-bold text-2xl text-white">
                Entrar no CMS
              </h3>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-email"
                  className="text-xs font-display uppercase tracking-widest text-neutral-400"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    ref={firstInputRef}
                    id="login-email"
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@portfolio.com"
                    className="
                      w-full bg-neutral-900/50 border border-neutral-800 rounded-lg 
                      pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-600 
                      focus:outline-none focus:border-(--accent-cyan)/50 focus:bg-neutral-900
                      transition-all duration-200 disabled:opacity-65
                    "
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-password"
                  className="text-xs font-display uppercase tracking-widest text-neutral-400"
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    id="login-password"
                    type="password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="
                      w-full bg-neutral-900/50 border border-neutral-800 rounded-lg 
                      pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-600 
                      focus:outline-none focus:border-(--accent-cyan)/50 focus:bg-neutral-900
                      transition-all duration-200 disabled:opacity-65
                    "
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="
                  mt-3 px-6 py-3.5 rounded-lg
                  bg-(--accent-cyan) text-neutral-950
                  font-display font-semibold text-xs uppercase tracking-widest
                  hover:shadow-[0_0_24px_rgba(0,209,255,0.3)]
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all duration-300 cursor-pointer
                "
              >
                {isLoading ? "Autenticando..." : "Entrar"}
              </button>
            </form>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
