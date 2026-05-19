import { ScrollReveal } from "../../shared/components/motion/ScrollReveal";

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

export function SkillsSection() {
  return (
    <section id="skills" className="relative z-10 py-24  px-4">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-display uppercase tracking-widest text-(--accent-cyan) mb-4 block ">
              Habilidades{" "}
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
              Stack técnica
            </h2>
            <p className="font-body text-(--text-secondary) max-w-xl mx-auto">
              Tecnologia que uso no dia para construir os projetos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SKILL_CATEGORIES.map((category) => (
              <SkillCategoryCard key={category.title} category={category} />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function SkillCategoryCard({ category }: { category: SkillCategory }) {
  return (
    <div
      className="
      bg-[rgba(11,16,32,0.6)] backdrop-blur-md
      border border-white/10 rounded-2xl p-6
      hover:border-(--accent-cyan)/20
      transition-all duration-300
    "
    >
      <h3 className="font-display font-semibold text-white text-lg mb-1">
        {category.title}
      </h3>
      <p className="text-xs text-(--text-muted) mb-6">{category.description}</p>
      <div className="grid grid-cols-3 gap-4">
        {category.skills.map((skill) => (
          <SkillItem key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );
}

function SkillItem({ skill }: { skill: Skill }) {
  return (
    <div
      className="
      group flex flex-col items-center gap-2 p-3 rounded-xl
      border border-transparent
      hover:border-white/10 hover:bg-white/5
      transition-all duration-200 cursor-default
    "
    >
      <i
        className={`${skill.icon} ${skill.colored ? "colored" : "text-(--text-secondary)"} text-3xl group-hover:scale-110 transition-transform duration-200`}
      />
      <span className="text-[10px] font-mono text-(--text-muted) text-center leading-tight group-hover:text-white transition-colors duration-200">
        {skill.name}
      </span>
    </div>
  );
}
