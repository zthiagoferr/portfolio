/* Local command terminal. Does not contact external servers. */
(() => {
  'use strict';
  const lang=()=>document.documentElement.lang==='en'?'en':'pt';
  const words={
    pt:{terminal:'Terminal do portfólio',cmd:'Digite help para ver os comandos',help:'Comandos: help, about, projects, skills, contact, github, clear',close:'Fechar'},
    en:{terminal:'Portfolio terminal',cmd:'Type help to see commands',help:'Commands: help, about, projects, skills, contact, github, clear',close:'Close'}
  };
  const tr=k=>words[lang()][k];
 function initTerminal(){const root=document.getElementById('portfolio-terminal-root');if(!root)return;
  root.innerHTML=`<button type="button" class="smart-terminal-launch" aria-expanded="false" aria-controls="smart-terminal">&gt;_ <span>${tr('terminal')}</span></button><section id="smart-terminal" class="smart-terminal" hidden role="region" aria-label="${tr('terminal')}"><div class="smart-chat-head"><strong>thiago@portfolio:~$</strong><button type="button" data-close aria-label="${tr('close')}">×</button></div><div class="smart-terminal-log" role="log" aria-live="polite"></div><form class="smart-terminal-form"><label for="smart-command">$</label><input id="smart-command" name="command" spellcheck="false" autocomplete="off" placeholder="${tr('cmd')}"></form></section>`;
  const panel=root.querySelector('.smart-terminal'),log=root.querySelector('.smart-terminal-log'),button=root.querySelector('.smart-terminal-launch');
  const toggle=val=>{panel.hidden=!val;button.setAttribute('aria-expanded',String(val));if(val)panel.querySelector('input').focus()};button.onclick=()=>toggle(panel.hidden);root.querySelector('[data-close]').onclick=()=>toggle(false);
  const entries={about:'Thiago Ferreira de Oliveira — Python, backend, APIs e agentes de IA.',projects:'DevPilot AI • Casa do Pastel Judá • URL Shortener API • DevShowcase',skills:'Python • FastAPI • TypeScript • Angular • SQL • Docker • MCP',contact:'thia80.ferreira@gmail.com',github:'https://github.com/zthiagoferr'};
  const line=text=>{const node=document.createElement('p');node.textContent=text;log.append(node);log.scrollTop=log.scrollHeight};
  root.querySelector('form').onsubmit=ev=>{ev.preventDefault();const inp=ev.currentTarget.elements.command;const cmd=inp.value.trim().toLowerCase();inp.value='';if(!cmd)return;line('$ '+cmd);if(cmd==='clear'){log.replaceChildren();return}line(cmd==='help'?tr('help'):entries[cmd]||'Comando desconhecido / Unknown command. help')};
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&!panel.hidden)toggle(false);if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='j'){ev.preventDefault();toggle(true)}});
 }
  initTerminal();
  let lastLang=lang();
  const observer=new MutationObserver(()=>{const newLang=lang();if(lastLang===newLang)return;lastLang=newLang;initTerminal()});
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
