# Portfólio — Landing Page Profissional

Landing page / portfólio pessoal estático, preparada para publicação em **GitHub Pages** e **GitLab Pages**.

Foco: desenvolvimento com **Python**, **backend e APIs**, **agentes de IA** (arquitetura multiagente, Skills, MCP, agentes especializados e Orquestrador), **frontend e interfaces** e **DevOps e ferramentas**.

## Seções da página

- **Início / Hero** — chamada inicial com tecnologias e áreas de atuação.
- **Sobre** — apresentação profissional curta, baseada nos conhecimentos e projetos do portfólio.
- **Competências** — quatro pilares: Backend & APIs, Agentes de IA & Automação, Frontend & Interfaces e DevOps & Ferramentas; Arduino aparece como conhecimento complementar.
- **Agentes de IA** — ambiente multiagente (Orquestrador, Analista, Arquiteto, Engenheiro, Revisor e Pesquisador) e destaques.
- **Certificações e Formação** — três certificados concluídos (SENAI) e um curso em andamento.
- **Projetos** — três projetos reais com repositórios no GitHub.
- **Contato** — e-mail, GitHub, GitLab e LinkedIn.

## Stack

- HTML5 + CSS3 + JavaScript vanilla (melhoria progressiva);
- **Zero dependências, zero build, zero CDNs, zero fontes externas**;
- Conteúdo 100% no HTML — a página é totalmente funcional e legível com JavaScript desativado.

## Como executar localmente

Opção 1 — servidor local:

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

Opção 2 — sem servidor: abra o arquivo `index.html` diretamente no navegador (`file://`). Tudo é relativo, portanto funciona.

## Estrutura de arquivos

```
.
├── index.html                 # página única (conteúdo 100% no HTML)
├── README.md
├── .gitignore
├── .gitlab-ci.yml             # job "pages" (inerte localmente, só age no GitLab)
└── assets/
    ├── css/
    │   ├── tokens.css         # design tokens (cores, tipografia, espaçamento, radii, sombras)
    │   ├── base.css           # reset mínimo, tipografia, links, focus-visible, skip-link
    │   ├── layout.css         # container, header/nav, seções, hero, footer, breakpoints
    │   └── components.css     # cards, badges, botões, menu mobile, animações/reveal
    └── js/
        └── main.js            # <script defer>: menu mobile, ano do footer, reveal, scrollspy, smooth scroll
```

Não há `assets/img` — os ícones são SVG inline.

## Conteúdo

Todo o conteúdo da página está preenchido:

- **Sobre** — apresentação profissional curta (sem placeholder).
- **Projetos** — três projetos reais, com descrição e repositórios no GitHub:
  - **Casa do Pastel Judá — Bot de Pedidos** → `https://github.com/zthiagoferr/pastelaria-bot`
  - **URL Shortener API** → `https://github.com/zthiagoferr/url-shortener`
  - **DevShowcase** → `https://github.com/zthiagoferr/devshowcase`
- **Contato** — e-mail, GitHub, GitLab e LinkedIn preenchidos com os dados reais.

## Preparação para GitHub Pages (ação futura do DONO — não executada)

1. Criar repositório no GitHub e fazer push da branch `main` (não realizado nesta entrega).
2. No repositório: **Settings → Pages → Build and deployment → Source: "Deploy from a branch" → Branch: `main` → pasta `/` (raiz)**.
3. Salvar; o site fica disponível em `https://<usuario>.github.io/<repositorio>/`.

## Preparação para GitLab Pages (ação futura do DONO — não executada)

1. O `.gitlab-ci.yml` já existe no projeto e ativa o job `pages` (copiando `index.html` + `assets/` para `public/`).
2. Fazer push do projeto para um repositório GitLab (não realizado nesta entrega); o job roda automaticamente na branch `main`.
3. O site fica disponível em `https://<usuario>.gitlab.io/<projeto>/`.

> O `.gitlab-ci.yml` é inerte localmente: só executa no GitLab CI após o push pelo dono.

## Status

Nenhum `git init`, commit, push ou deploy foi realizado. Único arquivo pré-existente: `REQUISITOS.md` (fonte da verdade, não alterado).