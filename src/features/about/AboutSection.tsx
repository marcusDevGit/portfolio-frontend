// About Section — foto + resumo profissional
import { PROJECTS } from '../projects/projects.data'


export function AboutSection() {
  return (
    <section id="about" className="relative z-10 py-24 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <span className="text-xs font-display uppercase tracking-widest text-(--accent-cyan) mb-4 block">
            Sobre
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
            Quem sou eu
          </h2>
        </div>

        {/* Layout: foto + texto */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 items-start">

          {/* ── Coluna esquerda: foto ─────────────────── */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-56 h-56 md:w-64 md:h-64">
              {/* Anel de glow externo */}
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-(--accent-cyan)/30 to-(--accent-soft)/20 blur-xl" />

              {/* Foto */}
              <img
                src="/images/perfil-port.png"
                alt="Marcus Phellypp — Desenvolvedor Full Stack"
                className="
                  relative z-10 w-full h-full
                  rounded-full object-cover
                  border-2 border-white/10
                "
                onError={(e) => {
                  // Fallback: iniciais enquanto a foto não é adicionada
                  const target = e.currentTarget
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />

              {/* Fallback visual — aparece só se a imagem não carregar */}
              <div
                style={{ display: 'none' }}
                className="
                  relative z-10 w-full h-full
                  rounded-full border-2 border-white/10
                  bg-[rgba(11,16,32,0.8)]
                  flex items-center justify-center
                "
              >
                <span className="font-display font-bold text-4xl text-(--accent-cyan)">
                  MP
                </span>
              </div>
            </div>
          </div>

          {/* ── Coluna direita: bio ───────────────────── */}
          <div className="
            bg-[rgba(11,16,32,0.6)] backdrop-blur-md
            border border-white/10 rounded-2xl p-8
          ">
            <div className="space-y-4 font-body text-base text-(--text-secondary) leading-relaxed">
              <p>
                Desenvolvedor{' '}
                <strong className="text-white font-medium">Full Stack</strong>{' '}
                em formação, com foco em aplicações modernas utilizando
                React.js, Node.js, PostgreSQL e JavaScript. Adiquirindo experiência
                com desenvolvimento de interfaces responsivas, APIs REST e
                integração entre frontend e backend.
              </p>
              <p>
                Além da área de tecnologia, minha trajetória profissional
                desenvolveu habilidades importantes como{' '}
                <strong className="text-white font-medium">
                  trabalho em equipe, suporte técnico, comunicação.
                </strong>

              </p>
              <p>
                Atualmente busco oportunidades para crescer como desenvolvedor
                e contribuir com projetos reais no mercado de tecnologia.
              </p>
            </div>

            {/* ── Stats rápidos ──────────────────────── */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <p className="font-display font-bold text-2xl text-(--accent-cyan)">{PROJECTS.length}</p>
                <p className="text-xs font-display uppercase tracking-widest text-(--text-muted) mt-1">
                  Projetos realizados
                </p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-2xl text-(--accent-cyan)">Full Stack</p>
                <p className="text-xs font-display uppercase tracking-widest text-(--text-muted) mt-1">
                  Perfil técnico
                </p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-2xl text-(--accent-cyan)">100%</p>
                <p className="text-xs font-display uppercase tracking-widest text-(--text-muted) mt-1">
                  Comprometimento
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
