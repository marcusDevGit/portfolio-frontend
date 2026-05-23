import { useEffect } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { useCursorStore } from "../../stores/useCursorStore";

export function CustomCursor() {
  const isHovering = useCursorStore((state) => state.isHovering);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <m.div
      style={{
        translateX: "-50%",
        translateY: "-50%",
        left: springX,
        top: springY,
      }}
      animate={{
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering
          ? "rgba(99, 179, 237, 0.25)"
          : "rgba(99, 179, 237, 0.6)",
        borderColor: isHovering
          ? "rgba(99, 179, 237, 0.8)"
          : "rgba(99, 179, 237, 0.4)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="
                pointer-events-none fixed z-9999
                h-3 w-3 rounded-full border
                hidden md:block
            "
    />
  );
}
