# 🎨 Meu Portfólio Premium Frontend

Este é o repositório público do Frontend do meu portfólio pessoal (Versão 2). Ele foi desenhado com um foco gigantesco em **UX/UI avançada**, **Performance Absoluta** e **Acessibilidade**.

Este é o repositório do Frontend do meu portfólio pessoal (Versão 2). Ele foi desenhado com um foco gigantesco em **UX/UI avançada**, **Performance Absoluta** e **Acessibilidade**.

## 🛠️ Tecnologias Utilizadas

### Frontend (Repositório Atual - Vercel)

- **React + Vite:** Para um desenvolvimento e build ultra rápidos.
- **TypeScript:** Tipagem forte para maior segurança e prevenção de bugs.
- **Tailwind CSS:** Utilizado para estilização utilitária e backgrounds complexos (efeitos de Glassmorphism e Auroras em CSS puro).
- **Framer Motion:** Animações fluidas a 60FPS.
  - Implementação completa com `<LazyMotion>` para reduzir drasticamente o tamanho do bundle final.
  - Aceleração de hardware com `transform-gpu` para aliviar a CPU do usuário.
  - Acessibilidade ativada via `useReducedMotion`, removendo animações de translação agressivas para usuários que ativaram "Reduzir Movimento" no Sistema Operacional.
- **Zustand:** Gerenciamento de estado global leve e sem boilerplate (utilizado para controlar o Custom Cursor).
- **React Helmet Async:** Injeção dinâmica de tags SEO e Open Graph, garantindo previews ricos em redes sociais (LinkedIn, WhatsApp, Twitter).

### Backend (Repositório Privado - Google Cloud Run)

- **Node.js + Express:** API RESTful focada em performance e consumo eficiente de recursos.
- **TypeScript:** Utilizado ponta a ponta para unificar a linguagem com o Frontend.
- **Prisma ORM:** Modelagem de banco de dados _Type-Safe_ com Singleton para otimizar conexões em ambiente Serverless.
- **NeonDB (PostgreSQL):** Banco de dados relacional e Serverless para persistência de Projetos e mensagens de Contato.
- **Upstash (Redis):** Cache em memória ultrarrápido para suportar o BFF.
- **Padrão BFF (Backend for Frontend):** Intermedia a comunicação pesada com a API do GitHub (cálculo de commits e linguagens) fazendo cache no Redis por 24h para evitar limitação de uso (Rate Limit).

## ✨ Principais Features

1. **Estudos de Caso (React Portals):**
   Os detalhes de cada projeto ("Case Studies") são renderizados em um Modal de alto nível. Utilizando `createPortal`, o componente é injetado diretamente na raiz do DOM (`document.body`), o que evita colisões de `z-index` e mantém a acessibilidade perfeita.

2. **Custom Cursor Inteligente:**
   Um cursor personalizado que rastreia o movimento do mouse, expandindo ao passar sobre links e botões. Uma verificação via `matchMedia('(pointer: coarse)')` garante que os _EventListeners_ de movimento sejam desativados em telas Touch (celulares e tablets), economizando ciclos de CPU e bateria do usuário.

3. **Integração Backend (GitHub Insights):**
   As estatísticas do GitHub (Linguagens, Streaks, Último Commit) não chamam a API do GitHub diretamente pelo front. O Frontend consome a minha API Backend privada, que faz o cálculo pesado das estatísticas, as empacota em um JSON e faz o cache no Redis.
