import { useEffect, useRef } from "react";
import { useEasterEggStore } from "../../stores/useEasterEggStore";

export function MatrixRain() {
  const isMatrixActive = useEasterEggStore((state) => state.isMatrixActive);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isMatrixActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const alphabet = "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890";
    const fontSize = 14;

    let columns = Math.floor(width / fontSize);

    let drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 8, 22, 0.06)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(
          Math.floor(Math.random() * alphabet.length),
        );

        const isFirstChar = Math.random() > 0.98;
        ctx.fillStyle = isFirstChar ? "#FFFFFF" : "#00D1FF";

        ctx.shadowBlur = isFirstChar ? 10 : 0;
        ctx.shadowColor = "#00D1FF";

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    let animationFrameId: number;
    const tick = () => {
      draw();
      animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMatrixActive]);

  useEffect(() => {
    if (!isMatrixActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        useEasterEggStore.getState().setMatrixActive(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMatrixActive]);

  if (!isMatrixActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 animate-fade-in bg-[#050816]/95"
    />
  );
}
