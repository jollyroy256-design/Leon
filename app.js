const icons={check:'<path d="m5 12 4 4L19 6"/>',globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12a23 23 0 0 0 18 0M10 12v3h4v-3"/>',passport:'<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="10" r="4"/><path d="M8 18h8M8 10h8M12 6v8"/>',shield:'<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z"/><path d="m8 12 3 3 5-6"/>',plane:'<path d="m22 2-7 20-4-9-9-4L22 2ZM22 2 11 13"/>',tool:'<path d="M14 6a5 5 0 0 0-6 6L3 17a3 3 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-3 3-4-4 3-3Z"/>',heart:'<path d="M20 4c-3-2-6 0-8 2-2-2-5-4-8-2-5 4 0 10 8 16 8-6 13-12 8-16Z"/>',store:'<path d="M3 10h18l-2-7H5l-2 7ZM5 10v11h14V10M9 21v-7h6v7M2 10c0 4 5 4 5 0 0 4 5 4 5 0 0 4 5 4 5 0 0 4 5 4 5 0"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',people:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v3"/>',message:'<path d="M21 11a8 8 0 0 1-8 8H6l-4 3V5a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v6Z"/><path d="M6 7h11M6 11h8"/>'};
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[el.dataset.icon]||icons.globe}</svg>`);
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){menu.click();menu.focus();}});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});document.querySelectorAll('[data-category]').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter);}));
const form=document.querySelector('#enquiry-form'),service=document.querySelector('#service'),interest=document.querySelector('#interest');
function updateService(){const map={'Overseas work':['Your trade or role','e.g. Plumber'],'Hire manpower':['Company / required roles','e.g. Company name, 10 welders'],'Documentation support':['Document assistance needed','e.g. Passport, PCC, verification'],'Ticket booking':['Destination / travel route','e.g. Bengaluru to destination']};const [label,placeholder]=map[service.value];document.querySelector('#interest-label').textContent=label;interest.placeholder=placeholder;}
service.addEventListener('change',updateService);
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{service.value=button.dataset.service;interest.value=button.dataset.interest||'';updateService();document.querySelector('#enquire').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('#name').focus({preventScroll:true});}));
const phone=document.querySelector('#phone');phone.addEventListener('input',()=>phone.setCustomValidity(''));
form.addEventListener('submit',async e=>{e.preventDefault();const normalized=phone.value.replace(/[\s-]/g,'');if(!/^(?:\+91)?[6-9]\d{9}$/.test(normalized)){phone.setCustomValidity('Enter a 10-digit Indian mobile number, optionally beginning with +91.');phone.reportValidity();return;}const status=document.querySelector('#form-status'),submit=form.querySelector('[type="submit"]');submit.disabled=true;submit.textContent='Saving enquiry…';status.className='';status.textContent='';const data=Object.fromEntries(new FormData(form));data.phone=normalized;data.consent=document.querySelector('#consent').checked;try{const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw Error(result.error||'Unable to save. Please try again.');status.className='success';status.textContent=`${result.message} Reference: ${result.id}`;form.reset();updateService();}catch(error){status.className='error';status.textContent=error.message||'Connection failed. Please try again.';}finally{submit.disabled=false;submit.innerHTML='Save my enquiry <span aria-hidden="true">↗</span>';}});
const dialog=document.querySelector('#privacy-dialog');document.querySelectorAll('.privacy-link').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));document.querySelectorAll('.dialog-close,.close-privacy').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',e=>{if(e.target===dialog){const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close();}});document.querySelector('#year').textContent=new Date().getFullYear();
const header = document.querySelector('header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40), {passive:true});
const dock = document.querySelector('.mobile-dock');
new IntersectionObserver(entries => { dock.hidden = entries[0].isIntersecting; }, {threshold:0.05}).observe(document.querySelector('#enquire'));
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    nav.querySelectorAll('a').forEach(link => {
      const active = link.hash === '#' + entry.target.id;
      link.classList.toggle('current', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  });
}, {rootMargin:'-15% 0px -65% 0px'});
document.querySelectorAll('#services,#opportunities,#process,#employers,#enquire').forEach(section => sectionObserver.observe(section));

// Scroll depth is limited to photography; captions and controls stay in place.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const photoLayers = [...document.querySelectorAll('.hero-visual, .role-image')];
const visiblePhotos = new Set();
let motionFrame = 0;
function paintScrollDepth() {
  motionFrame = 0;
  if (document.hidden) return;
  const viewport = window.innerHeight;
  const travel = document.documentElement.scrollHeight - viewport;
  header.style.setProperty('--scroll-progress', travel > 0 ? Math.min(1, window.scrollY / travel) : 0);
  if (motionPreference.matches) return;
  const mobile = window.innerWidth <= 600;
  const updates = [...visiblePhotos].map(layer => {
    const bounds = layer.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, (viewport - bounds.top * 2 - bounds.height) / (viewport + bounds.height)));
    const strength = layer.classList.contains('hero-visual') ? (mobile ? 12 : 36) : (mobile ? 7 : 18);
    return [layer, progress * strength];
  });
  updates.forEach(([layer, offset]) => layer.style.setProperty('--photo-offset', `${offset.toFixed(2)}px`));
}
function scheduleScrollDepth() {
  if (!motionFrame && !document.hidden) motionFrame = requestAnimationFrame(paintScrollDepth);
}
const photoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.isIntersecting ? visiblePhotos.add(entry.target) : visiblePhotos.delete(entry.target));
  scheduleScrollDepth();
});
photoLayers.forEach(layer => photoObserver.observe(layer));
function syncMotionPreference() {
  document.body.classList.toggle('parallax-enabled', !motionPreference.matches);
  if (motionPreference.matches) photoLayers.forEach(layer => layer.style.removeProperty('--photo-offset'));
  scheduleScrollDepth();
}
window.addEventListener('scroll', scheduleScrollDepth, {passive:true});
window.addEventListener('resize', scheduleScrollDepth, {passive:true});
motionPreference.addEventListener('change', syncMotionPreference);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && motionFrame) { cancelAnimationFrame(motionFrame); motionFrame = 0; }
  else scheduleScrollDepth();
});
syncMotionPreference();
