import { useEffect, useState } from "react";
import { ScrollReveal } from "../../shared/components/motion/ScrollReveal";
import { useCursorStore } from "../../shared/stores/useCursorStore";

const GITHUB_USERNAME = "marcusDevGit";

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
};

export function GitHubSection() {
  const [latestRepo, setLatestRepo] = useState<GitHubRepo | null>(null);
  const [languages, setLanguages] = useState<{ name: string; count: number }[]>(
    [],
  );
  const [status, setStatus] = useState<
    "loading" | "error" | "success" | "idle"
  >("loading");
  const [imgError, setImgError] = useState(false);

  const setHovering = useCursorStore((state) => state.setHovering);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");

    fetch(`${import.meta.env.VITE_API_URL}/api/github/stats`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Falha na API");
        const data = await res.json();

        if (data.repos.length > 0) {
          setLatestRepo(data.repos[0]);
        }

        setLanguages(data.languages.slice(0, 4));
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return (
    <section id="github" className="relative z-10 py-24 px-4">
      <ScrollReveal>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-display uppercase tracking-widest text-(--accent-cyan) mb-4 block">
              Open Source
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
              Engenharia Aberta
            </h2>
            <p className="font-body text-(--text-secondary) max-w-xl mx-auto">
              Foco no código atual. Consistência fala mais alto que palavras.
            </p>
          </div>
          <div className="mb-10">
            {!imgError ? (
              <img
                src={`https://ghchart.rshah.org/${GITHUB_USERNAME}`}
                alt="Calendário de contribuições do GitHub de Marcus"
                className="w-full rounded-xl border border-white/10 opacity-90 max-block-screen"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full rounded-2xl border border-white/10 bg-[rgba(11,16,32,0.6)] p-8 text-center">
                Gráfico de contribuições temporariamente indisponível.
              </div>
            )}
          </div>
          {status === "loading" && (
            <div className="text-center text-zinc-500 animate-pulse">
              Sincronizando com o GitHub...
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col gap-8">
              {/* Linha Superior: Stack e Streak (Lado a lado no Desktop) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stack Principal */}
                <div className="bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                  <h3 className="font-display text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 text-center">
                    Stack Principal Atual
                  </h3>
                  <div className="space-y-4 max-w-xs mx-auto w-full">
                    {languages.map((lang) => (
                      <div
                        key={lang.name}
                        className="flex justify-between items-center border-b border-white/5 pb-2"
                      >
                        <span className="text-white font-mono text-sm">
                          {lang.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* GitHub Streak */}
                <div className="bg-white/2 border border-white/5 rounded-2xl p-6 flex items-center justify-center">
                  <img
                    src={`https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&theme=dark&hide_border=true&background=00000000&ring=06b6d4&fire=06b6d4&currStreakNum=ffffff`}
                    alt="GitHub Streak Stats"
                    className="w-full max-w-md opacity-90"
                  />
                </div>
              </div>
              {/* Linha Inferior: Último Commit (Ocupando largura total) */}
              <div className="bg-white/2 border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col">
                <h3 className="font-display text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8 text-center">
                  Último Commit
                </h3>
                {latestRepo ? (
                  <a
                    href={latestRepo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    className="group max-w-3xl mx-auto w-full p-6 sm:p-8 rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 hover:border-(--accent-cyan)/50 transition-all flex flex-col"
                  >
                    <h4 className="text-white font-bold text-xl mb-3 group-hover:text-(--accent-cyan) transition-colors">
                      {latestRepo.name}
                    </h4>
                    <p className="text-sm text-zinc-500 line-clamp-3 mb-6 flex-1">
                      {latestRepo.description ||
                        "Desenvolvimento ativo. Acesse para ver o código fonte."}
                    </p>
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-4 border-t border-white/5">
                      <span className="text-(--accent-cyan)">
                        {latestRepo.language || "Code"}
                      </span>
                      <span>⭐ {latestRepo.stargazers_count}</span>
                    </div>
                  </a>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                    Nenhum repositório público recente.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-center mt-10">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-(--text-primary) font-display font-semibold text-sm uppercase tracking-widest hover:border-(--accent-cyan)/50 hover:text-white transition-all duration-300"
            >
              Ver perfil completo
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
