# Implantação no GitHub Pages

**Repositório:** `zthiagoferr/portfolio`  
**Endereço do site:** https://zthiagoferr.github.io/portfolio/  
**Método:** GitHub Actions (não publicação manual do código TypeScript).

## Preparar a versão local

1. Faça **backup** da versão publicada e do repositório local antes de substituir os arquivos.
2. Extraia o ZIP e copie o **conteúdo** da pasta `portfolio-angular/` para a **raiz** do repositório Git existente. Preserve a pasta oculta `.git/`; evite deixar arquivos antigos de versões anteriores misturados.
3. Se necessário, configure novamente o Web3Forms no arquivo `public/config.js`. Os ZIPs distribuídos não incluem a chave pessoal. O endereço de contato exibido é `thia80.ferreira@gmail.com`.
4. Na raiz do projeto, onde fica `package.json`, execute:

   ```bash
   npm install
   npm start
   ```

5. Acesse http://localhost:4200/ e confirme tema, idiomas, card 3D, terminal Python e envio de contato.
6. Teste o build de publicação:

   ```bash
   npm run build -- --configuration production --base-href /portfolio/
   ```

   A saída esperada é `dist/portfolio/browser/`.

## Configurar o GitHub uma vez

1. Abra https://github.com/zthiagoferr/portfolio.
2. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions** como origem da implantação.
3. Confirme que a branch principal do repositório é `main`, conforme configurado em `.github/workflows/deploy-pages.yml`.
4. Verifique que o arquivo de workflow está no GitHub em `.github/workflows/deploy-pages.yml`.

## Enviar alterações

```bash
git status
git add .
git commit -m "Atualiza portfolio Angular e documentacao"
git push origin main
```

A cada push na `main`, o GitHub Actions instala as dependências com Node.js 22, executa o build com `--base-href /portfolio/` e publica a pasta `dist/portfolio/browser/`.

Acesse **Actions** e acompanhe o workflow **Publicar Portfólio Angular no GitHub Pages**. Ao concluir, confirme o funcionamento em https://zthiagoferr.github.io/portfolio/.

## Checklist após publicação

- [ ] Site abre na URL `/portfolio/` sem página em branco.
- [ ] Estilos, fotografia e animações carregam (sem erros 404).
- [ ] Alternância de tema e idioma funciona.
- [ ] Card da fotografia gira com mouse e teclado; terminal Python anima no verso.
- [ ] O Portfolio Terminal continua acessível.
- [ ] Formulário Web3Forms envia uma mensagem real e ela chega à caixa de entrada.
- [ ] Não existe barra de rolagem horizontal indevida em dispositivos móveis.

## Problemas frequentes

**404 em arquivos JS, CSS ou imagens:** confirme que o build usou `--base-href /portfolio/` e que o site está na URL com `/portfolio/`.

**Workflow não inicia:** confira se enviou a branch `main` e se `.github/workflows/deploy-pages.yml` está presente. Confira também a aba Actions e as permissões do repositório.

**Build falha:** leia a mensagem de erro na aba Actions; tente reproduzir localmente com o comando de build acima. O ZIP foi validado estruturalmente, mas isso não substitui a compilação local.

**Formulário não envia:** confira `public/config.js`, a chave vinculada ao e-mail correto, a aba Network/Console no navegador e as configurações do Web3Forms. Lembre-se: `public/config.js` é público após o deploy.

**Deploy antigo ainda aparece:** confirme que o workflow terminou com sucesso e recarregue a página ignorando o cache (`Ctrl+Shift+R`).

**Importante:** não publique `node_modules/` nem `dist/` como código-fonte. O GitHub Actions gera e implanta os arquivos compilados automaticamente.
