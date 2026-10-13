const icons={check:'<path d="m5 12 4 4L19 6"/>',globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12a23 23 0 0 0 18 0M10 12v3h4v-3"/>',passport:'<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="10" r="4"/><path d="M8 18h8M8 10h8M12 6v8"/>',shield:'<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z"/><path d="m8 12 3 3 5-6"/>',plane:'<path d="m22 2-7 20-4-9-9-4L22 2ZM22 2 11 13"/>',tool:'<path d="M14 6a5 5 0 0 0-6 6L3 17a3 3 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-3 3-4-4 3-3Z"/>',heart:'<path d="M20 4c-3-2-6 0-8 2-2-2-5-4-8-2-5 4 0 10 8 16 8-6 13-12 8-16Z"/>',store:'<path d="M3 10h18l-2-7H5l-2 7ZM5 10v11h14V10M9 21v-7h6v7M2 10c0 4 5 4 5 0 0 4 5 4 5 0 0 4 5 4 5 0 0 4 5 4 5 0"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',people:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v3"/>',message:'<path d="M21 11a8 8 0 0 1-8 8H6l-4 3V5a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v6Z"/><path d="M6 7h11M6 11h8"/>'};
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[el.dataset.icon]||icons.globe}</svg>`);
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
const navTopics=[...nav.querySelectorAll('.nav-topic')];
const navDesktop=matchMedia('(min-width:901px) and (hover:hover) and (pointer:fine)');
let navHoverTimer;
function closeTopics(){clearTimeout(navHoverTimer);navTopics.forEach(topic=>{topic.querySelector('.nav-trigger').setAttribute('aria-expanded','false');topic.querySelector('.nav-dropdown').hidden=true;});}
function openTopic(topic){closeTopics();topic.querySelector('.nav-trigger').setAttribute('aria-expanded','true');topic.querySelector('.nav-dropdown').hidden=false;}
function closeNavigation(){closeTopics();nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';closeTopics();menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open);});
navTopics.forEach(topic=>{
 const trigger=topic.querySelector('.nav-trigger');
 trigger.addEventListener('click',()=>{const open=trigger.getAttribute('aria-expanded')==='true';if(open)closeTopics();else openTopic(topic);});
 trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();openTopic(topic);topic.querySelector('.nav-dropdown-link').focus();}});
 topic.addEventListener('pointerenter',()=>{if(navDesktop.matches){clearTimeout(navHoverTimer);navHoverTimer=setTimeout(()=>openTopic(topic),140);}});
 topic.addEventListener('pointerleave',()=>{clearTimeout(navHoverTimer);if(navDesktop.matches&&!topic.contains(document.activeElement))navHoverTimer=setTimeout(closeTopics,220);});
 topic.addEventListener('focusout',()=>{setTimeout(()=>{if(!topic.contains(document.activeElement)&&trigger.getAttribute('aria-expanded')==='true')closeTopics();},0);});
});
nav.querySelectorAll('a,.nav-dropdown-link').forEach(link=>link.addEventListener('click',()=>{
 // Keep a visible focus return target when an action opens the booking dialog.
 if(link.hasAttribute('data-open-booking'))(matchMedia('(max-width:900px)').matches?menu:link.closest('.nav-topic').querySelector('.nav-trigger')).focus();
 closeNavigation();
}));
document.addEventListener('pointerdown',event=>{if(!nav.contains(event.target)&&!menu.contains(event.target))closeNavigation();});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const active=nav.querySelector('.nav-trigger[aria-expanded="true"]');if(active){closeTopics();active.focus();}else if(nav.classList.contains('open')){closeNavigation();menu.focus();}});
matchMedia('(min-width:901px)').addEventListener('change',closeNavigation);
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});document.querySelectorAll('[data-category]').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter);}));
const form=document.querySelector('#enquiry-form'),service=document.querySelector('#service'),interest=document.querySelector('#interest');
function updateService(){const map={'Overseas work':['Your trade or role','e.g. Plumber'],'Hire manpower':['Company / required roles','e.g. Company name, 10 welders'],'Documentation support':['Document assistance needed','e.g. Passport, PCC, verification'],'Ticket booking':['Destination / travel route','e.g. Bengaluru to destination']};const [label,placeholder]=map[service.value];document.querySelector('#interest-label').textContent=label;interest.placeholder=placeholder;}
service.addEventListener('change',updateService);
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{service.value=button.dataset.service;interest.value=button.dataset.interest||'';updateService();document.querySelector('#enquire').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('#name').focus({preventScroll:true});}));
const phone=document.querySelector('#phone');phone.addEventListener('input',()=>phone.setCustomValidity(''));
form.addEventListener('submit',async e=>{e.preventDefault();const normalized=phone.value.replace(/[\s-]/g,'');if(!/^(?:\+91)?[6-9]\d{9}$/.test(normalized)){phone.setCustomValidity('Enter a 10-digit Indian mobile number, optionally beginning with +91.');phone.reportValidity();return;}const status=document.querySelector('#form-status'),submit=form.querySelector('[type="submit"]');submit.disabled=true;submit.textContent='Saving enquiry…';status.className='';status.textContent='';const data=Object.fromEntries(new FormData(form));if(pendingBooking){if(!validBookingDate(pendingBooking.date)){status.className='error';status.textContent='Your preferred date has passed. Please select a new date in the calendar.';submit.disabled=false;submit.innerHTML='Save my enquiry <span aria-hidden="true">↗</span>';return;}data.message=`Consultation request: ${pendingBooking.date} at ${pendingBooking.time} IST (Asia/Kolkata). Subject to confirmation.\n\n${data.message||''}`;}data.phone=normalized;data.consent=document.querySelector('#consent').checked;try{const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw Error(result.error||'Unable to save. Please try again.');status.className='success';status.textContent=`${result.message} Reference: ${result.id}`;form.reset();updateService();}catch(error){status.className='error';status.textContent=error.message||'Connection failed. Please try again.';}finally{submit.disabled=false;submit.innerHTML='Save my enquiry <span aria-hidden="true">↗</span>';}});
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

// One time-based animation loop eases depth without changing native scroll behavior.
const heroScene = document.querySelector('.hero');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const photoLayers = [...document.querySelectorAll('.role-image')];
const visiblePhotos = new Set();
const photoOffsets = new Map();
let motionFrame = 0, lastFrame = 0;
let pointerX = 0, pointerY = 0, currentX = 0, currentY = 0;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
function paintScrollDepth(now) {
  motionFrame = 0;
  if (document.hidden) return;
  const travel = document.documentElement.scrollHeight - innerHeight;
  header.style.setProperty('--scroll-progress', travel > 0 ? clamp(scrollY / travel, 0, 1) : 0);
  if (motionPreference.matches) { lastFrame = 0; return; }
  const delta = lastFrame ? Math.min(now - lastFrame, 64) : 16.67;
  lastFrame = now;
  const easing = 1 - Math.exp(-delta / 95);
  const bounds = heroScene.getBoundingClientRect();
  const mobile = innerWidth <= 600;
  const progress = clamp(-bounds.top / bounds.height, 0, 1);
  const targetX = finePointer.matches && !mobile ? pointerX : 0;
  const targetY = progress * (mobile ? 24 : 65) + (finePointer.matches && !mobile ? pointerY : 0);
  currentX += (targetX - currentX) * easing;
  currentY += (targetY - currentY) * easing;
  heroScene.style.setProperty('--landscape-x', `${currentX.toFixed(3)}px`);
  heroScene.style.setProperty('--landscape-y', `${currentY.toFixed(3)}px`);
  let unsettled = Math.abs(targetX - currentX) > .03 || Math.abs(targetY - currentY) > .03;
  // Read all visible geometry before writing transforms.
  const updates = [...visiblePhotos].map(layer => {
    const rect = layer.getBoundingClientRect();
    const progress = clamp((innerHeight - rect.top * 2 - rect.height) / (innerHeight + rect.height), -1, 1);
    const target = progress * (mobile ? 8 : 16);
    const current = photoOffsets.get(layer) || 0;
    const next = current + (target - current) * easing;
    if (Math.abs(next - target) > .03) unsettled = true;
    photoOffsets.set(layer, next);
    return [layer, next];
  });
  updates.forEach(([layer, offset]) => layer.style.setProperty('--photo-offset', `${offset.toFixed(3)}px`));
  if (unsettled) motionFrame = requestAnimationFrame(paintScrollDepth);
  else lastFrame = 0;
}
function scheduleScrollDepth() {
  if (!motionFrame && !document.hidden) motionFrame = requestAnimationFrame(paintScrollDepth);
}
const photoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.isIntersecting ? visiblePhotos.add(entry.target) : visiblePhotos.delete(entry.target));
  scheduleScrollDepth();
});
photoLayers.forEach(layer => photoObserver.observe(layer));
function resetPointer() { pointerX = 0; pointerY = 0; scheduleScrollDepth(); }
heroScene.addEventListener('pointermove', event => {
  if (motionPreference.matches || !finePointer.matches || innerWidth <= 600) return;
  const rect = heroScene.getBoundingClientRect();
  pointerX = clamp((event.clientX - rect.left) / rect.width - .5, -.5, .5) * -14;
  pointerY = clamp((event.clientY - rect.top) / rect.height - .5, -.5, .5) * -10;
  scheduleScrollDepth();
}, {passive:true});
heroScene.addEventListener('pointerleave', resetPointer);
function syncMotionPreference() {
  document.body.classList.toggle('parallax-enabled', !motionPreference.matches);
  if (motionFrame) cancelAnimationFrame(motionFrame);
  motionFrame = 0; lastFrame = 0;
  pointerX = pointerY = currentX = currentY = 0;
  photoOffsets.clear();
  ['--landscape-x', '--landscape-y'].forEach(name => heroScene.style.removeProperty(name));
  photoLayers.forEach(layer => layer.style.removeProperty('--photo-offset'));
  scheduleScrollDepth();
}
window.addEventListener('scroll', scheduleScrollDepth, {passive:true});
window.addEventListener('resize', resetPointer, {passive:true});
motionPreference.addEventListener('change', syncMotionPreference);
finePointer.addEventListener('change', resetPointer);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(motionFrame); motionFrame = 0; lastFrame = 0; }
  else scheduleScrollDepth();
});
syncMotionPreference();
// Consultation requests use India time and the existing local enquiry workflow.
let pendingBooking = null;
const bookingTime = document.querySelector('#booking-time');
const bookingSelection = document.querySelector('#booking-selection');
const bookingSummary = document.querySelector('#booking-summary');
const calendarDays = document.querySelector('#calendar-days');
const calendarPrev = document.querySelector('#calendar-prev');
const calendarNext = document.querySelector('#calendar-next');
function indiaToday() {
  const parts = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const part = key => parts.find(p => p.type === key).value;
  return new Date(`${part('year')}-${part('month')}-${part('day')}T00:00:00Z`);
}
function bookingRange() {
  const first = indiaToday(); first.setUTCDate(first.getUTCDate()+1);
  const last = indiaToday(); last.setUTCDate(last.getUTCDate()+90);
  return {first,last};
}
const dateKey = date => date.toISOString().slice(0,10);
const dateLabel = date => new Intl.DateTimeFormat('en-GB',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date);
let calendarMonth = bookingRange().first;
calendarMonth = new Date(Date.UTC(calendarMonth.getUTCFullYear(), calendarMonth.getUTCMonth(),1));
let chosenDate = '';
function renderCalendar() {
  const {first,last} = bookingRange();
  const year = calendarMonth.getUTCFullYear(), month = calendarMonth.getUTCMonth();
  document.querySelector('#calendar-month').textContent = new Intl.DateTimeFormat('en-GB',{timeZone:'UTC',month:'long',year:'numeric'}).format(calendarMonth);
  calendarPrev.disabled = new Date(Date.UTC(year,month,0)) < first;
  calendarNext.disabled = new Date(Date.UTC(year,month+1,1)) > last;
  calendarDays.replaceChildren();
  const offset = (calendarMonth.getUTCDay()+6)%7;
  for(let i=0;i<offset;i++) {const blank=document.createElement('span');blank.setAttribute('aria-hidden','true');calendarDays.append(blank);}
  const count = new Date(Date.UTC(year,month+1,0)).getUTCDate();
  for(let day=1;day<=count;day++) {
    const date = new Date(Date.UTC(year,month,day));
    const key = dateKey(date), button = document.createElement('button');
    button.type='button';button.textContent=day;button.dataset.date=key;
    button.disabled=date<first||date>last;
    button.setAttribute('aria-label',dateLabel(date));button.setAttribute('aria-pressed',String(chosenDate===key));
    button.addEventListener('click',()=>{
      chosenDate=key;
      calendarDays.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      bookingSelection.textContent=dateLabel(date);
    });
    calendarDays.append(button);
  }
}
calendarPrev.addEventListener('click',()=>{calendarMonth.setUTCMonth(calendarMonth.getUTCMonth()-1);renderCalendar();});
calendarNext.addEventListener('click',()=>{calendarMonth.setUTCMonth(calendarMonth.getUTCMonth()+1);renderCalendar();});
function validBookingDate(key) {const {first,last}=bookingRange();return key>=dateKey(first)&&key<=dateKey(last);}
document.querySelector('#booking-continue').addEventListener('click',()=>{
  if(!chosenDate||!validBookingDate(chosenDate)) {bookingSelection.textContent='Please choose a future date within the next 90 days.';renderCalendar();calendarDays.querySelector('button:not(:disabled)')?.focus();return;}
  if(!bookingTime.reportValidity()) return;
  pendingBooking={date:chosenDate,time:bookingTime.value};
  bookingSummary.querySelector('p').textContent=`${dateLabel(new Date(chosenDate+'T00:00:00Z'))} at ${bookingTime.value} IST. Subject to confirmation.`;
  bookingSummary.hidden=false;
  bookingDialog.close();
  document.querySelector('#enquire').scrollIntoView({behavior:motionPreference.matches?'instant':'smooth'});
  document.querySelector('#name').focus({preventScroll:true});
});
function clearBooking() {pendingBooking=null;chosenDate='';bookingTime.value='';bookingSummary.hidden=true;bookingSelection.textContent='Select a date to get started.';renderCalendar();}
document.querySelector('#booking-remove').addEventListener('click',()=>{clearBooking();document.querySelector('#service').focus();});
form.addEventListener('reset',clearBooking);
renderCalendar();

// Native dialog provides keyboard containment, Escape dismissal and focus restoration.
const bookingDialog = document.querySelector('#booking');
document.querySelectorAll('[data-open-booking]').forEach(button => button.addEventListener('click', () => {
  renderCalendar();
  bookingDialog.showModal();
  document.body.classList.add('booking-open');
}));
document.querySelector('.booking-close').addEventListener('click', () => bookingDialog.close());
bookingDialog.addEventListener('close', () => document.body.classList.remove('booking-open'));
bookingDialog.addEventListener('click', event => {
  if (event.target !== bookingDialog) return;
  const bounds = bookingDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) bookingDialog.close();
});
// Animate the destination compass only while visible; hover/focus and user pause stop it.
const destinationsSection = document.querySelector('.destinations');
const orbitToggle = document.querySelector('.orbit-toggle');
let destinationsVisible = false;
function syncDestinationMotion() {
  destinationsSection.classList.toggle('in-view', destinationsVisible && !document.hidden);
}
new IntersectionObserver(entries => {
  destinationsVisible = entries[0].isIntersecting;
  syncDestinationMotion();
}, {threshold:.1}).observe(destinationsSection);
orbitToggle.addEventListener('click', () => {
  const paused = orbitToggle.getAttribute('aria-pressed') !== 'true';
  orbitToggle.setAttribute('aria-pressed', String(paused));
  orbitToggle.textContent = paused ? 'Resume flag motion' : 'Pause flag motion';
  destinationsSection.classList.toggle('motion-paused', paused);
});
document.addEventListener('visibilitychange', syncDestinationMotion);
