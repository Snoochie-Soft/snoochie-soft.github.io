/* Home page: tile glow follows the pointer, scroll-linked reveals. */
document.querySelectorAll('.tile').forEach(t=>t.addEventListener('pointermove',e=>{const r=t.getBoundingClientRect();t.style.setProperty('--mx',(e.clientX-r.left)+'px');t.style.setProperty('--my',(e.clientY-r.top)+'px')}));
initSmooth();
if(!RM){
  gsap.from('.pre,.hero h1,.hero p,.hero .btn',{y:50,opacity:0,duration:1.2,ease:'expo.out',stagger:.1,delay:.1});
  gsap.to('#bgart',{yPercent:-12,scale:1.15,ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:true}});
  gsap.utils.toArray('.bento .tile,.rg .tile,.contact .tile').forEach(t=>{
    gsap.from(t,{y:90,opacity:0,scale:.94,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:t,start:'top 90%'}});
    const p=t.querySelectorAll('.ph');p.forEach((x,k)=>gsap.from(x,{yPercent:30,opacity:0,duration:1.3,ease:'expo.out',delay:.15+k*.1,scrollTrigger:{trigger:t,start:'top 85%'}}));
  });
  gsap.from('.t7 .big',{x:180,opacity:0,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'.t7',start:'top 70%'}});
  gsap.to('.t7 .big',{y:-30,ease:'none',scrollTrigger:{trigger:'.t7',scrub:true,start:'top bottom',end:'bottom top'}});
  document.querySelectorAll('[data-n]').forEach(n=>{const v=+n.dataset.n;if(!v)return;const o={v:0};gsap.to(o,{v,duration:1.6,ease:'power2.out',scrollTrigger:{trigger:n,start:'top 92%'},onUpdate:()=>n.textContent=Math.round(o.v)})});
}
