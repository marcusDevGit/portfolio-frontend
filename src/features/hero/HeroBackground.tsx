import { m, useTransform, useReducedMotion, MotionValue } from "framer-motion";

interface HeroBackgroundProps {
  scrollYProgress: MotionValue<number>;
}

export function HeroBackground({ scrollYProgress }: HeroBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  // Mapeia o deslocamento vertical dos glows e do grid em diferentes taxas.
  // Como recebemos scrollYProgress do pai, não precisamos de useScroll local!
  const glowCyanY = useTransform(scrollYProgress, [0, 1], ["0px", "140px"]);
  const glowPurpleY = useTransform(scrollYProgress, [0, 1], ["0px", "-100px"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["0px", "60px"]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Grid digital sutil */}
      <m.div
        style={{ y: shouldReduceMotion ? 0 : gridY }}
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-subtle)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25"
      />

      {/* 2. Glow radial de cor Cyan no canto superior esquerdo */}
      <m.div
        style={{ y: shouldReduceMotion ? 0 : glowCyanY }}
        className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(0,209,255,0.12)_0%,transparent_70%)] blur-[80px]"
      />

      {/* 3. Glow radial de cor Purple no canto inferior direito */}
      <m.div
        style={{ y: shouldReduceMotion ? 0 : glowPurpleY }}
        className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(112,0,255,0.10)_0%,transparent_70%)] blur-[80px]"
      />
    </div>
  );
}
