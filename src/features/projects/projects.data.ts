// projects.data.ts — fonte única de verdade dos projetos
// Exportamos daqui para que ProjectsSection e AboutSection
// usem os MESMOS dados sem duplicação.
//
// Conceito: "Single Source of Truth" (SSOT)
// Um dado só existe em UM lugar. Se mudar aqui, muda em todo o app.

export type Project = {
  title: string
  description: string
  stack: string[]
  github?: string
  demo?: string
  highlight?: boolean
}

export const PROJECTS: Project[] = [
  {
    title: "Expense Tracker App",
    description:
      "Sistema completo de controle financeiro pessoal, desenvolvido com uma arquitetura moderna, escalável e segura.",
    stack: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Tailwind",
      "JWT",
    ],
    github: "https://github.com/marcusDevGit/expense-tracker-app.git",
    demo: "https://expense-tracker-app-seven-beta.vercel.app/",
    highlight: true,
  },
  {
    title: "frontend-mentor-challenges",
    description: "Coleção de desafios da plataforma Frontend Mentor",
    stack: ["React", "Vite", "API"],
    github: "https://github.com/marcusDevGit/frontend-mentor-challenges.git",
    demo: "https://marcusdevgit.github.io/frontend-mentor-challenges/",
    highlight: true,
  },
  {
    title: "To-Do App",
    description:
      "Aplicação full-stack para gerenciamento de tarefas, listas e tags com experiência de usuário fluida e recursos avançados de organização.",
    stack: [
      "React",
      "TypeScript",
      "Express",
      "Node.js",
      "Zod",
      "Prisma",
      "PostgreSQL",
      "Tailwind",
    ],
    github: "https://github.com/marcusDevGit/todo-app-full.git",
    highlight: true,
  },
]
