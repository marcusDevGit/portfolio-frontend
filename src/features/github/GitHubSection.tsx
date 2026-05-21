import { useEffect, useState } from "react";
import { ScrollReveal } from "../../shared/components/motion/ScrollReveal";

const GITHUB_USERNAME = "marcusDevGit";

type GitHubStats = {
  public_repos: number;
  monthlyContributions: number;
  accountAge: string;
};

type FetchStatus = "idle" | "loading" | "success" | "error";

export function GitHubSection() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");

    fetch(`${import.meta.env.VITE_API_URL}/api/github/stats`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`API: HTTP ${res.status}`);
        const json = await res.json();

        setStats(json);
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
              Atividade no GitHub
            </h2>
            <p className="font-body text-(--text-secondary) max-w-xl mx-auto">
              Acompanhe minha atividade e contribuições em tempo real.
            </p>
          </div>
          <div className="mb-10">
            {!imgError ? (
              <img
                src={`https://ghchart.rshah.org/${GITHUB_USERNAME}`}
                alt="Calendário de contribuições do GitHub de Marcus"
                className="w-full rounded-2xl border border-white/10 opacity-80"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full rounded-2xl border border-white/10 bg-[rgba(11,16,32,0.6)] p-8 text-center">
                <p className="text-(--text-muted) font-body text-sm">
                  Gráfico de contribuições temporariamente indisponível.
                </p>
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--accent-cyan) text-sm font-display mt-2 inline-block hover:underline"
                >
                  Ver no GitHub →
                </a>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {status === "loading" &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[rgba(11,16,32,0.6)] border border-white/10 rounded-2xl p-6 animate-pulse"
                >
                  <div className="h-8 bg-white/10 rounded mb-2 w-16 mx-auto" />
                  <div className="h-3 bg-white/5 rounded w-24 mx-auto" />
                </div>
              ))}
            {status === "error" && (
              <div className="col-span-3 text-center text-(--text-muted) font-body text-sm py-8">
                Não foi possível carregar os dados do GitHub no momento.
              </div>
            )}
            {status === "success" && stats && (
              <>
                <StatCard
                  value={stats.public_repos}
                  label="Repositórios públicos"
                />
                <StatCard
                  value={stats.monthlyContributions}
                  label="Contribuições este mês"
                />
                <StatCard value={stats.accountAge} label="No GitHub" />
              </>
            )}
          </div>
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

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div
      className="
      text-center
      bg-[rgba(11,16,32,0.6)] backdrop-blur-md
      border border-white/10 rounded-2xl p-6
      hover:border-(--accent-cyan)/20
      transition-all duration-300
    "
    >
      <p className="font-display font-bold text-3xl text-(--accent-cyan) mb-2">
        {value}
      </p>
      <p className="text-xs font-display uppercase tracking-widest text-(--text-muted)">
        {label}
      </p>
    </div>
  );
}
