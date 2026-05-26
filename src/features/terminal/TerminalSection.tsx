import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useTerminalStore } from "../../shared/stores/useTerminalStore";
import { X, Terminal as TerminalIcon } from "lucide-react";
import { PROJECTS } from "../projects/projects.data";

export function TerminalSection() {
  const { isOpen, close, history, setHistory, clearHistory } =
    useTerminalStore();
  const [inputVal, setInputVal] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommandSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const command = inputVal.trim();
    if (!command) return;

    const output = processCommand(command);

    if (output === "CLEAR_SCREEN") {
      clearHistory();
    } else {
      setHistory([
        ...history,
        { type: "input", text: command },
        { type: "output", text: output },
      ]);
    }

    setInputVal("");
  };

  const handleOpenProject = (index: number): string => {
    const projectIndex = index - 1;
    if (
      isNaN(projectIndex) ||
      projectIndex < 0 ||
      projectIndex >= PROJECTS.length
    ) {
      return `Erro: Índice de projeto inválido (1 a ${PROJECTS.length}). Use 'projects' para listar os índices.`;
    }
    const proj = PROJECTS[projectIndex];
    const urlToOpen = proj.demo || proj.github;
    if (urlToOpen) {
      window.open(urlToOpen, "_blank");
      return `Abrindo o projeto "${proj.title}" em uma nova aba...`;
    }
    return `O projeto "${proj.title}" não possui link cadastrado.`;
  };

  const processCommand = (cmd: string): string => {
    const trimmed = cmd.trim().toLowerCase();

    // 1. Atalho UX: se o usuário digitou apenas o número do projeto (ex: "1")
    if (/^\d+$/.test(trimmed)) {
      return handleOpenProject(parseInt(trimmed, 10));
    }

    // 2. Atalho UX: se o usuário digitou "open 1"
    if (trimmed.startsWith("open ")) {
      const numPart = trimmed.replace("open ", "").trim();
      if (/^\d+$/.test(numPart)) {
        return handleOpenProject(parseInt(numPart, 10));
      }
    }

    const parts = cmd.trim().split(" ");
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (mainCommand) {
      case "help":
        return `Comandos disponíveis:
  help      - Exibe esta lista de ajuda.
  about     - Biografia rápida do Marcus.
  projects  - Lista de projetos em destaque.
  skills    - Tecnologias e barra de domínio técnico.
  contact   - Links e informações de e-mail.
  neofetch  - Informações completas do sistema de dev.
  clear     - Limpa o histórico da tela.
  exit      - Fecha a janela do terminal.
  
`;

      case "about":
        return `Marcus Phellypp - Desenvolvedor Full Stack
------------------------------------------------
Focado no desenvolvimento de interfaces modernas e APIs robustas.
Especializado no ecossistema JavaScript/TypeScript (React, Node, Prisma, PostgreSQL).
Interessado em arquitetura de software limpa, segurança, e boas práticas de UX/UI.`;

      case "projects": {
        // Se o usuário digitou "projects open 1"
        if (args[0] === "open") {
          const projectIndex = parseInt(args[1], 10);
          return handleOpenProject(projectIndex);
        }

        // Atalho UX: se o usuário digitou "projects 1"
        const potentialNum = parseInt(args[0], 10);
        if (!isNaN(potentialNum)) {
          return handleOpenProject(potentialNum);
        }

        const list = PROJECTS.map(
          (p, i) =>
            `[${i + 1}] ${p.title} - ${p.description.substring(0, 80)}...`,
        ).join("\n");

        return `Projetos em Destaque:
---------------------
${list}

👉 Digite o número do projeto (ex: '1'), 'open 1' ou 'projects open 1' para abrir o link!`;
      }

      case "skills":
        return `Main Stack:
-----------------
- React.js      [██████░░░░░]
- Node.js       [████░░░░░░░]
- PostgreSQL    [████░░░░░░░]
- TypeScript    [███░░░░░░░░]
- Prisma ORM    [███░░░░░░░░]

Architecture Focus
- Clean Architecture
- REST APIs
- Component Design
- Scalable Frontend

Currently Learning
- Docker
- DevOps
- Cloud Infrastructure`;

      case "contact":
        return `Informações de Contato:
-----------------------
E-mail:   marcus_psc@hotmail.com
GitHub:   https://github.com/marcusDevGit
LinkedIn: https://linkedin.com/in/marcusphellypp`;

      case "neofetch":
        return `   .---.          visitor@marcus-system
  /     \\         ---------------------
  \\.---./          OS: MarcusOS v1.0
  |  💻 |          Host: portfolio-v1
  |     |          Uptime: 2 min (simulado)
  '---'            Shell: react-terminal-sh
                   Display: 1920x1080 (Responsive)
                   Theme: Glassmorphism Cinematic
                   Zustand: Active
                   Prisma Client: Connected
                   CPU: React Engine v19
                   Memory: 256MB / 16GB`;

      case "clear":
        return "CLEAR_SCREEN";
      case "exit":
        setTimeout(() => close(), 500);
        return "Fechando terminal...  Bye!";
      default:
        return `Comando não reconhecido: '${mainCommand}'. Digite 'help' para ver a lista de comandos.`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop escuro com blur */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          {/* Janela do Terminal */}
          <m.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={focusInput}
            className="
              relative w-full max-w-3xl h-120
              flex flex-col rounded-xl overflow-hidden
              bg-black/90 border border-(--border-bright)
              shadow-[0_0_50px_rgba(0,209,255,0.15)]
              text-[#00D1FF] font-mono text-sm
            "
          >
            {/* Barra superior de Cabeçalho */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/80 border-b border-(--border-subtle) select-none">
              <div className="flex items-center gap-2">
                <TerminalIcon size={16} className="text-neutral-400" />
                <span className="text-xs text-neutral-400 font-semibold font-display">
                  visitor@marcus-site: ~
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                className="
                  p-1 rounded-md text-neutral-400 hover:text-white
                  hover:bg-neutral-800 transition-colors cursor-pointer
                "
              >
                <X size={16} />
              </button>
            </div>
            {/* Corpo do Terminal (Logs) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
              {history.map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                  {line.type === "input" ? (
                    <p className="text-neutral-400">
                      <span className="text-(--accent-soft)">
                        visitor@marcus-site
                      </span>
                      :<span className="text-(--accent-cyan)">~</span>${" "}
                      {line.text}
                    </p>
                  ) : (
                    <pre className="font-mono text-[#00D1FF] whitespace-pre-wrap">
                      {line.text}
                    </pre>
                  )}
                </div>
              ))}
              <div ref={historyEndRef} />
            </div>
            {/* Linha de Prompt Ativo */}
            <form
              onSubmit={handleCommandSubmit}
              className="flex items-center gap-2 p-4 bg-neutral-950 border-t border-(--border-subtle)"
            >
              <span className="text-neutral-400 select-none">
                visitor@marcus-site:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 bg-transparent border-none text-[#00D1FF] focus:outline-hidden font-mono"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </form>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
