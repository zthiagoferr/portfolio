/* Six decorative cinematic effects. Canvas is capped to 24fps, pauses in background and honors reduced motion. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const hero = document.querySelector('.hero');
  if (!hero || document.getElementById('cinematic-ribbons')) return;
  const rays=document.createElement('span');rays.className='cinematic-volumetric';rays.setAttribute('aria-hidden','true');hero.prepend(rays);
  const grain=document.createElement('span');grain.className='cinematic-grain';grain.setAttribute('aria-hidden','true');document.body.append(grain);
  const ribbon=document.createElement('canvas');ribbon.id='cinematic-ribbons';ribbon.setAttribute('aria-hidden','true');document.body.prepend(ribbon);
  const items=[...document.querySelectorAll('.card,.portrait-wrap')];
  for(const el of items){
    const prism=document.createElement('span');prism.className='cinematic-prism';prism.setAttribute('aria-hidden','true');el.appendChild(prism);
  }
  // Decorative glass response on portrait: nothing intercepts clicks or focus.
  const portrait=document.querySelector('.portrait-wrap');
  if(portrait){
    const glass=document.createElement('span');glass.className='cinematic-glass';glass.setAttribute('aria-hidden','true');portrait.appendChild(glass);
    if(fine.matches && !reduced.matches){
      portrait.addEventListener('pointermove',e=>{
        const r=portrait.getBoundingClientRect();
        glass.style.setProperty('--glass-x',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
        glass.style.setProperty('--glass-y',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
        glass.classList.add('is-active');
      },{passive:true});
      portrait.addEventListener('pointerleave',()=>glass.classList.remove('is-active'));
    }
  }
  const headings=[...document.querySelectorAll('.section-title')];
  if(!reduced.matches && 'IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('cinematic-revealed');io.unobserve(entry.target)}});
    },{threshold:.06,rootMargin:'0px 0px -20px 0px'});
    headings.forEach(el=>{
      const rect=el.getBoundingClientRect();
      if(rect.bottom>0 && rect.top<innerHeight) return;
      el.classList.add('cinematic-reveal-ready');io.observe(el);
    });
    reduced.addEventListener('change',()=>{if(reduced.matches){io.disconnect();headings.forEach(el=>{el.classList.remove('cinematic-reveal-ready');el.classList.add('cinematic-revealed')})}});
  }
  const ctx=ribbon.getContext('2d',{alpha:true});
  if(!ctx)return;
  let w=0,h=0,raf=0,last=0,phase=0,visible=!document.hidden;
  function resize(){
    w=innerWidth;h=innerHeight;
    const dpr=Math.min(devicePixelRatio||1,1.5);
    ribbon.width=Math.round(w*dpr);ribbon.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function render(time){
    if(!visible||reduced.matches){raf=0;return}
    raf=requestAnimationFrame(render);
    if(time-last<42)return;
    const dt=Math.min(65,time-last||42);last=time;phase+=dt*.0001;
    ctx.clearRect(0,0,w,h);
    const count=w<700?2:4;
    for(let i=0;i<count;i++){
      const y0=h*(.22+i*.17);const amp=h*(.027+i*.008);const frequency=1.1+i*.13;
      ctx.beginPath();
      for(let x=0;x<=w+8;x+=8){
        const yy=y0+Math.sin(x/w*6.283*frequency+phase*(i%2?-.8:1)+i*.9)*amp;
        if(x===0)ctx.moveTo(x,yy);else ctx.lineTo(x,yy);
      }
      ctx.strokeStyle=`rgba(255,255,255,${(.055-i*.007).toFixed(3)})`;
      ctx.lineWidth=i===0?1.3:.85;
      ctx.stroke();
    }
  }
  const onResize=()=>resize();addEventListener('resize',onResize,{passive:true});resize();
  function start(){if(!raf&&!reduced.matches&&visible)raf=requestAnimationFrame(render)}
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)start();else{cancelAnimationFrame(raf);raf=0}});
  reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(raf);raf=0;ctx.clearRect(0,0,w,h)}else start()});
  start();
})();
