import { PROJECTS } from "../projects/projects.data";
import { ScrollReveal } from "../../shared/components/motion/ScrollReveal";

export function AboutSection() {
  return (
    <section id="about" className="relative z-10 py-24 px-4">
      <ScrollReveal>
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

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 items-start">
            <div className="flex justify-center md:justify-start">
              <div className="relative w-56 h-56 md:w-64 md:h-64">
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-(--accent-cyan)/30 to-(--accent-soft)/20 blur-xl" />
                <img
                  src="/images/perfil-port.png"
                  alt="Marcus Phellypp — Desenvolvedor Full Stack"
                  loading="lazy"
                  decoding="async"
                  className="
                  relative z-10 w-full h-full
                  rounded-full object-cover
                  border-2 border-white/10
                "
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />

                <div
                  style={{ display: "none" }}
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

            <div
              className="
            bg-[rgba(11,16,32,0.6)] backdrop-blur-md
            border border-white/10 rounded-2xl p-8
          "
            >
              <div className="space-y-4 font-body text-base text-(--text-secondary) leading-relaxed">
                <p>
                  Desenvolvedor{" "}
                  <strong className="text-white font-medium">Full Stack</strong>{" "}
                  em formação, com foco em aplicações modernas utilizando
                  React.js, Node.js, PostgreSQL e JavaScript. Adiquirindo
                  experiência com desenvolvimento de interfaces responsivas,
                  APIs REST e integração entre frontend e backend.
                </p>
                <p>
                  Além da área de tecnologia, minha trajetória profissional
                  desenvolveu habilidades importantes como{" "}
                  <strong className="text-white font-medium">
                    trabalho em equipe, suporte técnico, comunicação.
                  </strong>
                </p>
                <p>
                  Atualmente busco oportunidades para crescer como desenvolvedor
                  e contribuir com projetos reais no mercado de tecnologia.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-(--accent-cyan)">
                    {PROJECTS.length}
                  </p>
                  <p className="text-xs font-display uppercase tracking-widest text-(--text-muted) mt-1">
                    Projetos realizados
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-(--accent-cyan)">
                    Full Stack
                  </p>
                  <p className="text-xs font-display uppercase tracking-widest text-(--text-muted) mt-1">
                    Perfil técnico
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-(--accent-cyan)">
                    100%
                  </p>
                  <p className="text-xs font-display uppercase tracking-widest text-(--text-muted) mt-1">
                    Foco
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
