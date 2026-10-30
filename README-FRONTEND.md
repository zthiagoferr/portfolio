# Arquitetura do frontend

O portfólio é uma aplicação **Angular 20** que utiliza uma view principal e scripts JavaScript anteriores à migração Angular.

- `src/app/app.component.html` contém a estrutura da página.
- `src/app/app.component.ts` inicializa os scripts de interação no navegador e os remove quando apropriado.
- `public/assets/css/` e `src/styles.css` reúnem os estilos.
- `public/assets/js/main.js` controla recursos como formulário, idioma e tema.
- `public/assets/js/python-flip-card.js` implementa o card giratório e a digitação Python ilustrativa.
- `public/assets/js/cinematic-effects.js` e `cinematic-premium.js` acrescentam efeitos decorativos.

**Sem backend próprio:** não há FastAPI, execução remota de Python ou agentes de IA reais. A seção de agentes é informativa, e o terminal é uma interação local de apresentação.

## Desenvolvimento

```bash
npm install
npm start
```

O Web3Forms depende da chave pública configurada em `public/config.js`, e não de um servidor local. Veja [README.md](README.md) para a configuração.

Esta edição usa o **visual cinematográfico escuro original**, sem o teste posterior de Liquid Glass.
