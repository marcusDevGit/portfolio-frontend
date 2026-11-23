import { useState, useEffect } from "react";
import { ScrollReveal } from "../../shared/components/motion/ScrollReveal";
import { useProfileStore } from "../../shared/stores/useProfileStore";

type Skill = {
  name: string;
  icon: string;
  colored?: boolean;
};
type SkillCategory = {
  title: string;
  description: string;
  skills: Skill[];
};

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend",
    description: "interfaces modernas e responsivas",
    skills: [
      { name: "React", icon: "devicon-react-original", colored: true },
      { name: "JavaScript", icon: "devicon-javascript-plain", colored: true },
      { name: "Tailwind", icon: "devicon-tailwindcss-plain", colored: true },
      { name: "HTML", icon: "devicon-html5-plain", colored: true },
      { name: "CSS", icon: "devicon-css3-plain", colored: true },
    ],
  },
  {
    title: "Backend",
    description: "APIs escaláveis e seguras",
    skills: [
      { name: "TypeScript", icon: "devicon-typescript-plain", colored: true },
      { name: "Node.js", icon: "devicon-nodejs-plain", colored: true },
      { name: "Express", icon: "devicon-express-original", colored: true },
      { name: "PostgreSQL", icon: "devicon-postgresql-plain", colored: true },
      { name: "Prisma", icon: "devicon-prisma-original", colored: false },
    ],
  },
  {
    title: "Ferramentas",
    description: "Fluxo de trabalho profissional",
    skills: [
      { name: "Git", icon: "devicon-git-plain", colored: true },
      { name: "GitHub", icon: "devicon-github-original", colored: true },
      { name: "Docker", icon: "devicon-docker-plain", colored: true },
    ],
  },
];

const EMPTY_STACKS: string[] = [];

export function SkillsSection() {
  const activeStacks = useProfileStore((state) => state.profile?.stacks ?? EMPTY_STACKS);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const [activeCategory, setActiveCategory] = useState<string>(
    SKILL_CATEGORIES[0].title,
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const selectedCategory =
    SKILL_CATEGORIES.find((cat) => cat.title === activeCategory) ??
    SKILL_CATEGORIES[0];

  return (
    <section id="skills" className="relative z-10 py-14 md:py-24 px-4">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-display uppercase tracking-widest text-(--accent-cyan) mb-4 block ">
              Habilidades{" "}
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-(--text-primary) mb-4">
              Stack técnica
            </h2>
            <p className="font-body text-(--text-secondary) max-w-xl mx-auto">
              Tecnologia que uso no dia a dia para construir os projetos.
            </p>
          </div>

          {/* Mobile: abas compactas para evitar 3 cards empilhados */}
          <div className="md:hidden space-y-4">
            <div
              className="flex items-center justify-center gap-2"
              role="tablist"
              aria-label="Categorias de habilidades"
            >
              {SKILL_CATEGORIES.map((category) => {
                const isSelected = category.title === selectedCategory.title;
                return (
                  <button
                    key={category.title}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveCategory(category.title)}
                    className={`
                      px-3.5 py-2 rounded-xl text-xs font-display uppercase tracking-wider transition-all cursor-pointer border
                      ${
                        isSelected
                          ? "bg-(--accent-cyan) text-neutral-950 border-(--accent-cyan) font-semibold"
                          : "bg-(--bg-card) text-(--text-secondary) border-(--border-subtle)"
                      }
                    `}
                  >
                    {category.title}
                  </button>
                );
              })}
            </div>
            <SkillCategoryCard category={selectedCategory} />
          </div>

          {/* Desktop: grid completo com 3 colunas */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {SKILL_CATEGORIES.map((category) => (
              <SkillCategoryCard key={category.title} category={category} />
            ))}
          </div>
          {activeStacks.length > 0 && (
            <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-(--border-subtle) text-center">
              <span className="text-xs font-display uppercase tracking-widest text-(--text-muted) mb-4 block">
                Outras Tecnologias & Stacks Ativas
              </span>
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                {activeStacks.map((stack) => (
                  <span
                    key={stack}
                    className="
                      px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-900 
                      text-xs font-mono text-neutral-300 hover:border-(--accent-cyan)/30 
                      hover:text-white transition-all select-none
                    "
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}

function SkillCategoryCard({ category }: { category: SkillCategory }) {
  const [showAll, setShowAll] = useState(false);
  const visibleSkills = showAll ? category.skills : category.skills.slice(0, 3);
  const hasMore = category.skills.length > 3;
  return (
    <div
      className="
      bg-(--bg-card) backdrop-blur-md
      border border-(--border-subtle) rounded-2xl p-6
      hover:border-(--accent-cyan)/20
      transition-all duration-300
    "
    >
      <h3 className="font-display font-semibold text-(--text-primary) text-lg mb-1">
        {category.title}
      </h3>
      <p className="text-xs text-(--text-muted) mb-6">{category.description}</p>
      <div className="grid grid-cols-3 gap-4">
        {visibleSkills.map((skill) => (
          <SkillItem key={skill.name} skill={skill} />
        ))}

        {!showAll &&
          category.skills.slice(3).map((skill) => (
            <div key={skill.name} className="hidden md:block">
              <SkillItem skill={skill} />
            </div>
          ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="md:hidden mt-4 text-xs font-display uppercase tracking-widest text-(--accent-cyan) hover:opacity-70 transition-opacity duration-200"
        >
          {showAll ? "Ver menos ↑" : `+${category.skills.length - 3} mais ↓`}
        </button>
      )}
    </div>
  );
}

function SkillItem({ skill }: { skill: Skill }) {
  return (
    <div
      className="
      group flex flex-col items-center gap-2 p-3 rounded-xl
      border border-transparent
      hover:border-(--border-subtle) hover:bg-(--bg-card)
      transition-all duration-200 cursor-default
    "
    >
      <i
        className={`${skill.icon} ${skill.colored ? "colored" : "text-(--text-secondary)"} text-3xl group-hover:scale-110 transition-transform duration-200`}
      />
      <span className="text-[10px] font-mono text-(--text-muted) text-center leading-tight group-hover:text-(--text-primary) transition-colors duration-200">
        {skill.name}
      </span>
    </div>
  );
}
