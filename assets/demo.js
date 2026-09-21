const btn=document.getElementById('menuBtn'),links=document.getElementById('navLinks');
btn.addEventListener('click',()=>links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
const io=new IntersectionObserver((es)=>{es.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('in'),i*60);io.unobserve(e.target);}});},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
