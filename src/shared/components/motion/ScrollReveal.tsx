import { m, useReducedMotion } from "framer-motion";

import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
}
export function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.8,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="transform-gpu will-change-transform"
    >
      {children}
    </m.div>
  );
}
