# 🌐 Personal Site — Frontend

Portfólio pessoal desenvolvido com **React + TypeScript + Tailwind CSS v4**, com foco em design cinematográfico, animações fluidas e consumo de APIs externas.

---

## 🚀 Stack

| Tecnologia | Versão | Finalidade |
|---|---|---|
| [React](https://react.dev/) | 19 | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org/) | 6 | Tipagem estática |
| [Vite](https://vite.dev/) | 8 | Bundler e dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilização utilitária |
| [Anime.js](https://animejs.com/) | 3 | Animações de entrada e loop |
| [Geist Font](https://vercel.com/font) | 1.7 | Tipografia |

---

## ⚙️ Instalação e execução

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (http://localhost:5173)
npm run dev

# Build de produção
npm run build

# Pré-visualizar o build
npm run preview
```

---

## 🗂️ Estrutura de pastas

```
src/
├── App.tsx                   # Componente raiz — monta as seções na ordem correta
├── main.tsx                  # Entry point do React
├── index.css                 # Design tokens globais (variáveis CSS, fontes, aurora)
│
├── features/                 # Seções da página (organizadas por feature)
│   ├── hero/
│   │   └── HeroSection.tsx   # Saudação animada com anime.js (typing loop)
│   ├── about/
│   │   └── AboutSection.tsx  # Foto, bio profissional e estatísticas dinâmicas
│   ├── projects/
│   │   ├── ProjectsSection.tsx
│   │   └── projects.data.ts  # ⭐ Single Source of Truth dos projetos
│   ├── skills/
│   │   └── SkillsSection.tsx # Stack técnica com ícones Devicon
│   ├── github/
│   │   └── GitHubSection.tsx # Dados em tempo real via GitHub REST API
│   └── contact/
│       └── ContactSection.tsx # Formulário de contato (via mailto)
│
└── shared/                   # Componentes e utilitários reutilizáveis
    ├── components/ui/
    │   ├── Navbar.tsx         # Navegação fixa com links de âncora
    │   └── Footer.tsx         # Rodapé com links sociais e voltar ao topo
    ├── hooks/                 # (reservado para hooks customizados futuros)
    └── utils/                 # (reservado para utilitários futuros)
```

---

## 📐 Convenções de arquitetura

### Feature-first
Cada seção da página vive em sua própria pasta dentro de `features/`. Isso mantém a responsabilidade isolada — o código de `hero` não interfere no de `github`.

### Single Source of Truth
Os projetos são declarados **apenas** em `projects.data.ts`. Tanto `ProjectsSection` quanto `AboutSection` (que conta o total) importam desse arquivo. Nunca duplique dados de projetos em outros lugares.

```ts
// ✅ Correto: importar do arquivo central
import { PROJECTS } from '../projects/projects.data'

// ❌ Errado: declarar projetos em dois lugares
const projects = [{ title: '...' }]
```

### Componentes sem lógica de negócio
Os componentes de `features/` são responsáveis apenas por **renderizar**. Qualquer lógica (cálculos, chamadas de API) deve ficar em `hooks/` ou `utils/` quando crescer.

---

## 🎬 Animações (Anime.js)

A `HeroSection` utiliza duas timelines encadeadas:

1. **Entrada** (`entrance`) — roda **uma vez**: badge, subtítulo e botões surgem.
2. **Loop** (`typingLoop`) — roda **infinitamente**: o texto da saudação digita e apaga.

```
[entrada única]
  badge aparece → letras digitam → nome revela → subtítulo + botões surgem

[loop ∞]
  letras digitam → nome revela → pausa 2.5s → nome apaga → letras somem → ...
```

> **Por que `animejs@3` e não v4?** A v4 foi completamente reescrita e não possui `export default`. A v3 é estável, bem documentada e compatível com o padrão de importação `import anime from 'animejs'`.

---

## 🌐 APIs externas

| API | Uso | Autenticação |
|---|---|---|
| `api.github.com/users/:username` | Dados do perfil (repos, data de criação) | Pública (sem token) |
| `api.github.com/users/:username/events/public` | Contribuições do mês atual | Pública (sem token) |
| `ghchart.rshah.org/:username` | Gráfico de contribuições (imagem SVG) | Nenhuma |

> **Limitação:** A API pública do GitHub limita **60 requisições/hora por IP** sem token. Para uso autenticado (sem limite), é necessário um backend com token seguro.

---

## 🖌️ Design System

As variáveis de design estão definidas em `index.css`:

| Variável | Valor | Uso |
|---|---|---|
| `--accent-cyan` | `#00d1ff` | Cor primária de destaque |
| `--accent-soft` | `#7b8ff5` | Gradientes e destaques secundários |
| `--text-primary` | `#f1f5f9` | Texto principal |
| `--text-secondary` | `#94a3b8` | Texto secundário |
| `--text-muted` | `#475569` | Texto de menor hierarquia |

---

## 📋 Próximos passos (backlog)

- [ ] **Backend Node.js** — Express + Nodemailer para o formulário de contato
- [ ] **Token GitHub** — chamadas autenticadas via backend (sem limite de rate)
- [ ] **SEO** — meta tags dinâmicas com `react-helmet`
- [ ] **Deploy** — pipeline na Vercel / Netlify
- [ ] **Foto real** — adicionar imagem em `public/images/perfil-port.png`
- [ ] **Testes** — unitários para `countMonthlyContributions` em `GitHubSection`
