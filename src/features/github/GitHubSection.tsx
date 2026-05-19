// GitHub Section — dados públicos via GitHub REST API
//
// ARQUITETURA: Chamada no frontend com API pública (sem token)
// Limite: 60 req/hora por IP — suficiente para portfólio
// Futuro: mover para backend Node.js com token e cache quando disponível
//
// Endpoint usado: GET https://api.github.com/users/{username}

import { useEffect, useState } from 'react'
import { ScrollReveal } from '../../shared/components/motion/ScrollReveal'

const GITHUB_USERNAME = 'marcusDevGit'

// ─── Tipo com apenas os campos que vamos usar ────────────
// A API retorna ~40 campos. Mapeamos só o necessário.
type GitHubUser = {
  public_repos: number
  created_at: string
}

type GitHubEvent = {
  type: string
  created_at: string
  payload: {
    size: number
  }
}

// ─── Estado possível da requisição ──────────────────────
// 'idle'    → ainda não iniciou
// 'loading' → aguardando resposta
// 'success' → dados chegaram
// 'error'   → algo deu errado
type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

function countMonthlyContributions(events: GitHubEvent[]): number {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return events.filter((event) => event.type === "PushEvent" && new Date(event.created_at) >= startOfMonth).reduce((total, event) => total + (event.payload.size ?? 1), 0)
}

function getAccountAge(createdAt: string): string {
  const years = new Date().getFullYear() - new Date(createdAt).getFullYear()
  return `${years} ano${years !== 1 ? 's' : ''}`
}


export function GitHubSection() {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [monthlyContributions, setMonthlyContributions] = useState<number>(0)
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('loading')

    const userUrl = `https://api.github.com/users/${GITHUB_USERNAME}`
    const eventsUrl = `https://api.github.com/users/${GITHUB_USERNAME}/events/public`

    Promise.all([fetch(userUrl), fetch(eventsUrl)])
      .then(async ([userRes, eventsRes]) => {
        if (!userRes.ok) throw new Error(`User API: HTTP ${userRes.status}`)
        if (!eventsRes.ok) throw new Error(`Event API: HTTP ${eventsRes.status}`)

        const userData: GitHubUser = await userRes.json()
        const eventsData: GitHubEvent[] = await eventsRes.json()

        setUser(userData)

        setMonthlyContributions(countMonthlyContributions(eventsData))
        setStatus('success')
      })
      .catch(() => {
        setStatus('error')
      })
  }, [])


  return (
    <section id="github" className="relative z-10 py-24 px-4">
      <ScrollReveal>


        <div className="max-w-5xl mx-auto">
          {/* Cabeçalho */}
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
          {/* Calendário de contribuições via ghchart.rshah.org */}
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
          {/* Stats da API pública */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Loading — 3 skeletons animados */}
            {status === 'loading' &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[rgba(11,16,32,0.6)] border border-white/10 rounded-2xl p-6 animate-pulse"
                >
                  <div className="h-8 bg-white/10 rounded mb-2 w-16 mx-auto" />
                  <div className="h-3 bg-white/5 rounded w-24 mx-auto" />
                </div>
              ))}
            {/* Error */}
            {status === 'error' && (
              <div className="col-span-3 text-center text-(--text-muted) font-body text-sm py-8">
                Não foi possível carregar os dados do GitHub no momento.
              </div>
            )}
            {/* Success — 3 cards com dados reais */}
            {status === 'success' && user && (
              <>
                <StatCard
                  value={user.public_repos}
                  label="Repositórios públicos"
                />
                <StatCard
                  value={monthlyContributions}
                  label="Contribuições este mês"
                />
                <StatCard
                  value={getAccountAge(user.created_at)}
                  label="No GitHub"
                />
              </>
            )}
          </div>
          {/* Link para o perfil */}
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
  )
}

// ─── Componente de stat individual ──────────────────────
// Aceita number ou string para ser flexível (ex: "2 anos")
function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="
      text-center
      bg-[rgba(11,16,32,0.6)] backdrop-blur-md
      border border-white/10 rounded-2xl p-6
      hover:border-(--accent-cyan)/20
      transition-all duration-300
    ">
      <p className="font-display font-bold text-3xl text-(--accent-cyan) mb-2">
        {value}
      </p>
      <p className="text-xs font-display uppercase tracking-widest text-(--text-muted)">
        {label}
      </p>
    </div>
  )
}
