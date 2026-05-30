# 🎨 Meu Portfólio Premium - Frontend

Este é o repositório público do Frontend do meu portfólio pessoal (Versão 2). Ele foi desenhado com um foco gigantesco em **UX/UI avançada**, **Performance Absoluta**, **Acessibilidade** e um **CMS Administrativo integrado**.

## 🛠️ Tecnologias Utilizadas

- **React + Vite:** Para um desenvolvimento e compilação rápidos.
- **TypeScript:** Segurança na tipagem e prevenção de erros em tempo de compilação.
- **Tailwind CSS:** Estilização utilitária moderna com efeitos de Glassmorphism e gradientes.
- **Framer Motion:** Animações fluidas a 60FPS usando `<LazyMotion>` e aceleração de hardware (`transform-gpu`) com suporte a acessibilidade (`useReducedMotion`).
- **Zustand:** Gerenciamento de estado global ultra-leve.
- **Supabase SDK (`@supabase/supabase-js`):** Utilizado diretamente no frontend para upload e remoção de mídias (foto de perfil e currículo PDF) no storage público.
- **React Helmet Async:** Injeção de tags dinâmicas de SEO e Open Graph.

## ✨ Principais Features

1. **Dashboard Administrativo / CMS Completo:**
   Aba `/admin` segura protegida por JWT contendo:
   - **Gestão de Perfil**: Edição de bio, whatsapp, tecnologias ativas, além de upload físico e remoção de foto e currículo PDF direto no Supabase Storage.
   - **Gerenciador de Mensagens**: Leitura, exclusão e controle de status de leitura de mensagens de contato.
   - **CRUD de Projetos**: Criação e edição de projetos com preenchimento síncrono dos dados e upload de banners direto para o Supabase.
   - **Estatísticas**: Totalizador de visitas e mensagens recebidas integrados em tempo real.

2. **Reordenação Dinâmica de Projetos (UX)**:
   Setas interativas na listagem de projetos para subir ou descer a prioridade. O frontend troca a posição na interface e dispara atualizações em paralelo (`Promise.all`) para o backend, otimizando o tempo de rede.

3. **Máscara de Senha Inteligente**:
   Inputs de formulários de senha com botões de alternância visuais (ícones `Eye` e `EyeOff` controlados por estados lógicos booleanos locais), melhorando a usabilidade.

4. **Estudos de Caso (React Portals):**
   Renderização dos detalhes de cada projeto em Modais injetados diretamente no topo do DOM (`document.body`) usando `createPortal`, o que isola conflitos de `z-index` e mantém a acessibilidade perfeita.

5. **Custom Cursor Responsivo**:
   Cursor dinâmico que se adapta ao hover. A verificação `matchMedia('(pointer: coarse)')` desativa a escuta em dispositivos touch (celulares/tablets), economizando ciclos de CPU e bateria.

## 🏃 Como rodar o projeto localmente

### Pré-requisitos
- Node.js (v20+)
- Backend correspondente rodando

### Passo 1: Instalação
```bash
npm install
```

### Passo 2: Configuração de Ambiente
Crie um arquivo `.env` na raiz do frontend:
```env
VITE_API_URL=http://localhost:3333
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_PUBLISHABLE_KEY=sb_pub_...
```

### Passo 3: Rodar o Servidor de Desenvolvimento
```bash
npm run dev
```

### 🚀 Deploy em Produção
O projeto está configurado na **Vercel** com deploy automático baseado em Git Push na branch `main`:
```bash
git push origin main
```
*Lembre-se de configurar as variáveis de ambiente no painel de administração da Vercel (`VITE_API_URL`, `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`) e forçar um redeploy quando atualizar os links de produção.*
