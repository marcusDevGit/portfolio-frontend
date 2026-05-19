import { useEffect, useRef } from "react";
import anime from "animejs";

// Dois segmentos para aplicar estilos diferentes:
// o nome recebe gradiente cyan, o resto fica branco
const GREETING_PREFIX = 'Olá, eu sou o ' // ← espaço no final garante distância antes de 'Marcus'
const GREETING_NAME = 'Marcus Phellypp'


export function HeroSection() {
  const badgeref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const scrrollRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Armazena a referência do loop para poder cancelar ao desmontar
    let typingLoop: ReturnType<typeof anime.timeline> | null = null
    // ─── Fase 2: loop de digitação (chamada após a entrada) ────
    const startTypingLoop = () => {
      // Reseta os elementos do h1 para o estado inicial
      // anime.set() aplica valores imediatamente (sem animação)
      anime.set('.hero-letter', { opacity: 0, translateY: 6 })
      anime.set('.hero-name', { opacity: 0, clipPath: 'inset(0 100% 0 0)' })
      typingLoop = anime.timeline({ easing: 'easeOutExpo', loop: true })
        // 1) Prefix: letras aparecem uma por uma
        .add({
          targets: '.hero-letter',
          opacity: [0, 1],
          translateY: [6, 0],
          duration: 50,
          delay: anime.stagger(65),
        })
        // 2) Nome: revela da esquerda para direita
        .add({
          targets: '.hero-name',
          clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
          opacity: [0, 1],
          duration: 900,
          easing: 'easeInOutQuad',
        })
        // 3) Pausa: texto visível por 2.5s
        // Animar opacity: 1 → 1 não tem efeito visual, só cria duração
        .add({
          targets: '.hero-name',
          opacity: 1,
          duration: 2500,
          easing: 'linear',
        })
        // 4) Nome some: apaga da direita para esquerda (clip-path reverso)
        .add({
          targets: '.hero-name',
          clipPath: ['inset(0 0% 0 0)', 'inset(0 100% 0 0)'],
          opacity: 1,
          duration: 700,
          easing: 'easeInOutQuad',
        })
        // 5) Prefix some: stagger reverso (de trás para frente)
        // direction: 'reverse' = a última letra some primeiro
        .add({
          targets: '.hero-letter',
          opacity: [1, 0],
          translateY: [0, -4],
          duration: 35,
          delay: anime.stagger(50, { direction: 'reverse' }),
        }, '-=300')
        // 6) Pausa curta antes de recomeçar
        .add({
          targets: '.hero-name',
          opacity: 0,
          duration: 600,
          easing: 'linear',
        })
    }
    // ─── Fase 1: entrada única ──────────────────────────────────
    // 'complete' dispara startTypingLoop quando esta timeline terminar
    const entrance = anime.timeline({
      easing: 'easeOutExpo',
      complete: startTypingLoop,
    })
    entrance
      .add({
        targets: badgeref.current,
        opacity: [0, 1],
        translateY: [-16, 0],
        duration: 500,
      })
      .add({
        targets: '.hero-letter',
        opacity: [0, 1],
        translateY: [6, 0],
        duration: 50,
        delay: anime.stagger(65),
      }, '-=100')
      .add({
        targets: '.hero-name',
        clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
        opacity: [0, 1],
        duration: 900,
        easing: 'easeInOutQuad',
      })
      .add({
        targets: subtitleRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
      }, '-=100')
      .add({
        targets: ctasRef.current,
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 500,
      }, '-=300')
      .add({
        targets: scrrollRef.current,
        opacity: [0, 1],
        duration: 400,
      }, '-=200')
    // Limpeza: pausa ambas as timelines ao desmontar o componente
    // Evita memory leak se o usuário navegar enquanto animações rodam
    return () => {
      entrance.pause()
      if (typingLoop) typingLoop.pause()
    }
  }, [])

  return (
    <section
      id="top"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 "
    >
      <div ref={badgeref} style={{ opacity: 0 }} className="flex items-center gap-2 mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--accent-cyan) opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-(--accent-cyan)" />
        </span>
        <span className="text-xs font-display font-semibold uppercase tracking-widest text-(--text-secondary)">
          Disponível para projetos
        </span>
      </div>
      {/* H1 principal — substitui o texto antigo
          Dividido em dois grupos de letras para aplicar gradiente só no nome.
          Cada letra é um <span> animado individualmente pelo anime.js via .hero-letter */}
      <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-[72px] leading-[1.1] tracking-[-0.04em] text-white mb-6">

        {/* Segmento 1: "Olá, eu sou o " — texto branco normal */}
        {GREETING_PREFIX.split('').map((char, index) => (
          <span
            key={`prefix-${index}`}
            className="hero-letter inline-block"
            style={{ opacity: 0 }}
          >
            {/* \u00A0 = non-breaking space: espaços dentro de inline-block colapsam no HTML */}
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}

        {/* Segmento 2: "Marcus Phellypp" como unidade única com gradiente
            - Usa clip-path (não opacity) para revelar da esquerda p/ direita
            - Classe 'hero-name' (separada de 'hero-letter') para ter animação própria
            - bg-clip-text funciona pois o texto está DIRETAMENTE no elemento */}
        <span
          className="hero-name inline-block text-transparent bg-clip-text bg-linear-to-r from-(--accent-cyan) to-(--accent-soft)"
          style={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
        >
          {GREETING_NAME}
        </span>

      </h1>
      <p ref={subtitleRef} style={{ opacity: 0 }} className="font-body text-lg md:text-xl text-(--text-secondary) max-w-2xl mb-10 leading-relaxed">
        Desenvolvedor focado em React, Node.js e TypeScript. Construindo
        interfaces modernas e APIs robustas com foco em
        <strong className="text-white font-medium">
          {" "}
          segurança e escalabilidade
        </strong>
        .
      </p>
      <div ref={ctasRef} style={{ opacity: 0 }} className="flex flex-col sm:flex-row items-center gap-4 mb-16">
        <a
          href="#projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-(--accent-cyan) text-[#050816] font-display font-semibold text-sm uppercase tracking-widest hover:shadow-[0_0_24px_4px_rgba(0,209,255,0.4)] transition-all duration-300"
        >
          Ver Projetos
          <span aria-hidden="true">→</span>
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-(--text-primary) font-display font-semibold text-sm uppercase tracking-widest hover:border-white/50 hover:text-white transition-all duration-300"
        >
          Entrar em Contato
        </a>
      </div>

      <div ref={scrrollRef} style={{ opacity: 0 }} className="[@media(min-height:700px)]:flex hidden absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2">
        <span className="text-xs text-(--text-muted) tracking-widest uppercase">
          scroll
        </span>
        <div className="w-px h-12 bg-linear-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}


