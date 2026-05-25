import { useEffect } from "react";
import { Command } from "cmdk";
import { m, AnimatePresence } from "framer-motion";
import { useCommandStore } from "../../stores/useCommandStore";
import { Briefcase, FileText, Mail, Sun } from "lucide-react";
import { toast } from "sonner";

export function CommandPalette() {
  const { isOpen, close, toggle } = useCommandStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle, isOpen, close]);

  const runCommand = (action: () => void) => {
    action();
    close();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm"
          />

          <m.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-(--bg-surface)/95 border border-(--border-subtle) shadow-2xl backdrop-blur-xl"
          >
            <Command
              className=" w-full"
              loop
              onKeyDown={(e) => {
                if (e.key === "Escape") close();
              }}
            >
              <div className="flex items-center border-b border-white/5 px-4">
                <Command.Input
                  autoFocus
                  placeholder="O que você procura?"
                  className="w-full bg-transparent py-4 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none text-lg font-body"
                />
              </div>
              <Command.List className="max-h-75 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <Command.Empty className="py-6 text-center text-sm text-zinc-500 font-body">
                  Nenhum resultado encontrado.
                </Command.Empty>
                <Command.Group
                  heading="Navegação"
                  className="text-xs font-display uppercase tracking-widest text-zinc-500 px-2 py-2"
                >
                  <Command.Item
                    onSelect={() =>
                      runCommand(() => (window.location.hash = "#about"))
                    }
                    className="flex items-center gap-3 px-3 py-3 mt-2 text-sm text-zinc-300 rounded-lg cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-(--text-primary) transition-colors"
                  >
                    <Briefcase size={16} /> Meus Projetos
                  </Command.Item>
                </Command.Group>
                <Command.Group
                  heading="Ações"
                  className="text-xs font-display uppercase tracking-widest text-zinc-500 px-2 pt-4 mt-2 border-t border-white/5"
                >
                  <Command.Item
                    onSelect={() =>
                      runCommand(() => window.open("/curriculo.pdf", "_blank"))
                    }
                    className="flex items-center gap-3 px-3 py-3 mt-2 text-sm text-zinc-300 rounded-lg cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-(--text-primary) transition-colors"
                  >
                    <FileText size={16} /> Baixar Currículo
                  </Command.Item>
                  <Command.Item
                    onSelect={() =>
                      runCommand(() => {
                        navigator.clipboard.writeText("marcus_psc@hotmail.com");
                        toast.success(
                          "Email copiado para área de transferência!",
                        );
                      })
                    }
                    className="flex items-center gap-3 px-3 py-3 mt-1 text-sm text-zinc-300 rounded-lg cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-(--text-primary) transition-colors"
                  >
                    <Mail size={16} /> Copiar E-mail
                  </Command.Item>
                  <Command.Item
                    onSelect={() =>
                      runCommand(() => alert("Em breve: Switcher de Tema!"))
                    }
                    className="flex items-center gap-3 px-3 py-3 mt-1 text-sm text-zinc-300 rounded-lg cursor-pointer data-[selected=true]:bg-white/10 data-[selected=true]:text-(--text-primary) transition-colors"
                  >
                    <Sun size={16} /> Alternar Tema Escuro/Claro
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
