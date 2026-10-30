/* Unique Edition: micro-interações autorais, sem dependências. */
(() => {
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const clock=document.querySelector('.signal-clock');
  const bars=document.querySelector('.signal-spectrum');
  if(bars){
    const fragment=document.createDocumentFragment();
    for(let i=0;i<30;i++){
      const bar=document.createElement('span');
      bar.style.setProperty('--bar-height',(25+Math.abs(Math.sin(i*1.87))*68)+'%');
      bar.style.setProperty('--pulse-duration',(1.1+(i%7)*.19)+'s');
      bar.style.setProperty('--pulse-delay',(-i*.13)+'s');
      fragment.append(bar);
    }
    bars.append(fragment);
  }
  // Relógio local do visitante (não simula telemetria real).
  const updateClock=()=>{if(clock){const d=new Date();clock.textContent=d.toLocaleTimeString('pt-BR',{hour12:false})}};
  updateClock();const clockTimer=setInterval(updateClock,1000);
  const projectCards=[...document.querySelectorAll('.fx-project-grid>.card')];
  projectCards.forEach((card,i)=>{
    const label=document.createElement('span');label.className='project-index';label.setAttribute('aria-hidden','true');label.textContent='PROJECT / '+String(i+1).padStart(2,'0');
    const corner=document.createElement('span');corner.className='project-corner';corner.setAttribute('aria-hidden','true');card.append(label,corner);
  });
  // Barra lateral acompanha o documento, aproveitando eventos passivos e um único rAF.
  const rail=document.getElementById('rail-indicator');
  const track=rail?.parentElement;let queued=false;
  const updateRail=()=>{
    queued=false;
    if(!rail||!track)return;
    const max=document.documentElement.scrollHeight-innerHeight;
    const amount=max>0?Math.max(0,Math.min(1,scrollY/max)):0;
    rail.style.setProperty('--rail-progress',Math.max(0,track.clientHeight-18)*amount+'px');
  };
  const onScroll=()=>{if(!queued){queued=true;requestAnimationFrame(updateRail)}};
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});updateRail();
  // Respeita a preferência de movimento reduzido também quando alterada em tempo real.
  const updateMotion=()=>{if(bars)bars.style.animationPlayState=reduce.matches?'paused':''};
  reduce.addEventListener?.('change',updateMotion);updateMotion();
  addEventListener('pagehide',()=>clearInterval(clockTimer),{once:true});
})();
