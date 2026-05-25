import { useState } from "react";
import { useCursorStore } from "../../shared/stores/useCursorStore";

export function ExpandableText({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const setHovering = useCursorStore((state) => state.setHovering);

  if (text.length <= 150) {
    return <p className="leading-relaxed">{text}</p>;
  }

  return (
    <div className="flex flex-col items-start">
      <p
        className={`leading-relaxed transition-all duration-300 ${
          isExpanded ? "line-clamp-none" : "line-clamp-3 text-zinc-400"
        }`}
      >
        {text}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="mt-2 text-[10px] font-bold uppercase tracking-widest text-(--accent-cyan) hover:text-(--text-primary) transition-colors"
      >
        {isExpanded ? "Ocultar detalhes" : "Ler detalhes"}
      </button>
    </div>
  );
}
