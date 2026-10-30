# Thiago Ferreira de Oliveira — Portfólio

Portfólio pessoal desenvolvido em **Angular 20**, TypeScript, HTML, CSS e JavaScript. Apresenta projetos, competências, cursos e uma seção conceitual sobre agentes de IA, com visual escuro, interações e versão em português/inglês.

**Site:** https://zthiagoferr.github.io/portfolio/  
**Repositório:** https://github.com/zthiagoferr/portfolio

## Principais funcionalidades

- Layout responsivo, navegação por seções, idiomas **PT/EN** e temas **escuro/claro**.
- Fundo tecnológico animado, grade/rede neural, efeitos cinematográficos, parallax e títulos com animação de decodificação.
- Card da fotografia com **giro 3D arrastando o mouse** (e interação via teclado); o verso contém um **terminal Python animado demonstrativo** — não executa Python.
- Seções de apresentação, competências, agentes de IA, cursos, projetos e contato.
- Diagrama de agentes **ilustrativo**, não conectado a agentes ou APIs reais.
- Portfolio Terminal no navegador, com comandos locais; não é um shell do sistema operacional.
- Formulário de contato via **Web3Forms**, com alternativa `mailto:` quando a chave não está configurada.
- Respeito a `prefers-reduced-motion` nas animações adicionais.

Esta edição **não usa Liquid Glass**, nem backend FastAPI, laboratório de agentes, assistente de IA ou painéis de GitHub em tempo real.

## Requisitos

- Node.js compatível com Angular 20 (o workflow de publicação utiliza **Node.js 22**).
- npm.

## Executar localmente

```bash
npm install
npm start
```

Acesse **http://localhost:4200/**. Execute os comandos na pasta onde está o `package.json`.

## Configurar o formulário de contato

1. Crie/valide uma Access Key no [Web3Forms](https://web3forms.com/) com o e-mail que receberá as mensagens.
2. Edite `public/config.js`:

   ```javascript
   window.PORTFOLIO_CONFIG = { web3formsAccessKey: 'SUA_ACCESS_KEY' };
   ```

3. Execute `npm start`, envie uma mensagem de teste na seção **Contato** e confirme o recebimento.

O e-mail exibido e usado no link de contato é **thia80.ferreira@gmail.com**. O Web3Forms entrega mensagens ao endereço associado à **chave**, que deve ser verificado no serviço. Com a chave vazia, o formulário utiliza a alternativa `mailto:`.

**Segurança:** `public/config.js` é copiado para o site público. A Access Key do Web3Forms é uma chave de cliente; **nunca inclua senhas, segredos de servidor ou tokens privados** nesse arquivo. Ative os mecanismos antispam oferecidos pelo serviço, conforme necessário.

## Build de produção

```bash
npm run build -- --configuration production --base-href /portfolio/
```

Para o projeto `zthiagoferr/portfolio`, o prefixo `/portfolio/` é necessário para carregar scripts, CSS e imagens no GitHub Pages. A saída esperada fica em **`dist/portfolio/browser/`**.

## Publicar no GitHub Pages

A publicação é feita pelo workflow **`.github/workflows/deploy-pages.yml`**, acionado por pushes na branch `main` ou manualmente na aba Actions.

Leia **[Guia de publicação](README-PUBLICACAO-GITHUB-PAGES.md)** antes de enviar a primeira versão. O código deve ficar **na raiz do repositório**, não dentro de uma subpasta extra `portfolio-angular/`.

## Organização do projeto

| Caminho | Responsabilidade |
| --- | --- |
| `src/app/app.component.html` | Estrutura da página e seções |
| `src/app/app.component.ts` | Componente Angular e carregamento dos scripts de interatividade |
| `src/styles.css` | Estilos e ajustes visuais recentes |
| `public/assets/css/` | Estilos originais do portfólio |
| `public/assets/js/main.js` | Navegação, idiomas, temas e envio do formulário, entre outras interações |
| `public/assets/js/python-flip-card.js` | Giro 3D da foto e animação de código Python |
| `public/assets/js/cinematic-*.js` | Efeitos decorativos cinematográficos |
| `public/assets/images/` | Imagens do projeto |
| `public/config.js` | Chave pública do Web3Forms |
| `.github/workflows/deploy-pages.yml` | Compilação e publicação automática no GitHub Pages |

A aplicação usa Angular como estrutura de execução, mas mantém scripts JavaScript legados para várias interações; **não é uma reescrita completa em componentes e serviços Angular**.

## Documentação complementar

- [Publicação e soluções de problemas](README-PUBLICACAO-GITHUB-PAGES.md)
- [Arquitetura do frontend](README-FRONTEND.md)
- [Efeitos Cinematic Premium](README-CINEMATIC-PREMIUM.md)
- [Histórico de mudanças](CHANGELOG.md)

## Observações

- Os terminais, indicadores e fluxos de agentes têm propósito visual/educacional: não executam código ou agentes no servidor.
- O layout deve ser testado com mouse, teclado, dispositivos móveis e os dois temas.
- Não envie `node_modules/`, `dist/` ou `.angular/` ao repositório.
