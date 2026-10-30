/* Arraste horizontalmente para girar o retrato; terminal visual Python, sem execução de código. */
(()=>{
 'use strict';
 const scene=document.getElementById('python-flip-card');
 if(!scene)return;
 const code=scene.querySelector('#python-typing-code');
 const output=scene.querySelector('#python-terminal-output');
 const back=scene.querySelector('.flip-card-back');
 const front=scene.querySelector('.flip-card-front');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const snippet=[
 'from dataclasses import dataclass',
 '',
 '@dataclass',
 'class Developer:',
 '    name: str = "Thiago Ferreira"',
 '    stack: tuple = ("Python", "Angular", "AI")',
 '',
 '    def build(self) -> str:',
 '        return "Ideias em código. 🚀"',
 '',
 'dev = Developer()',
 'print(dev.build())'
 ].join('\n');
 let angle=0,side=false,dragging=false,startX=0,startAngle=0,ptId=null,timer=0,index=0;
 function frame(deg){scene.style.setProperty('--flip-deg',deg+'deg')}
 function clearTyping(){clearTimeout(timer);timer=0}
 function type(){
   if(!side||document.hidden)return;
   if(reduced.matches){code.textContent=snippet;output.textContent='✓ Ideias em código. 🚀';return}
   index=Math.min(snippet.length,index+1);
   code.textContent=snippet.slice(0,index);
   if(index===snippet.length){output.textContent='✓ Ideias em código. 🚀\n✓ Script finalizado com sucesso';timer=setTimeout(()=>{if(side){index=0;code.textContent='';output.textContent='';type()}},3300)}
   else timer=setTimeout(type,snippet[index-1]==='\n'?135:28);
 }
 function renderSide(next){
   side=next;angle=side?180:0;frame(angle);
   back.setAttribute('aria-hidden',String(!side));front.setAttribute('aria-hidden',String(side));
   clearTyping();
   if(side){index=0;code.textContent='';output.textContent='';timer=setTimeout(type,reduced.matches?0:430)}
 }
 scene.addEventListener('pointerdown',e=>{
   if(e.button!==0)return;
   dragging=true;startX=e.clientX;startAngle=angle;ptId=e.pointerId;
   scene.classList.add('is-dragging');scene.setPointerCapture(e.pointerId);
 });
 scene.addEventListener('pointermove',e=>{
   if(!dragging||ptId!==e.pointerId)return;
   const w=Math.max(180,scene.getBoundingClientRect().width);
   const delta=(startX-e.clientX)/w*210;
   angle=Math.min(180,Math.max(0,startAngle+delta));frame(angle);
 });
 function finish(e){
   if(!dragging||(e&&ptId!==e.pointerId))return;
   dragging=false;scene.classList.remove('is-dragging');
   if(ptId!==null&&scene.hasPointerCapture(ptId))scene.releasePointerCapture(ptId);
   ptId=null;
   renderSide(angle>=90);
 }
 scene.addEventListener('pointerup',finish);scene.addEventListener('pointercancel',finish);
 scene.addEventListener('lostpointercapture',()=>{if(dragging){dragging=false;scene.classList.remove('is-dragging');renderSide(angle>=90)}});
 scene.addEventListener('keydown',e=>{if(['Enter',' ','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();renderSide(!side)}});
 document.addEventListener('visibilitychange',()=>{clearTyping();if(!document.hidden&&side)type()});
 renderSide(false);
})();
