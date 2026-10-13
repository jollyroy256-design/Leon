const {chromium}=require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
 const images=await page.locator('img').evaluateAll(nodes=>nodes.map(n=>({src:n.src,loaded:n.complete&&n.naturalWidth>0})));
 if(images.some(i=>!i.loaded))throw Error('An image failed to load');
 if(new Set(images.map(i=>i.src)).size!==images.length)throw Error('Repeated image');
 for(const width of [320,390,600,768,900,1024,1440]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow at '+width);}
 await page.setViewportSize({width:1440,height:1000});
 const initial=await page.locator('.hero-landscape').evaluate(el=>getComputedStyle(el).transform);
 await page.evaluate(()=>window.scrollTo({top:400,behavior:'instant'}));await page.waitForTimeout(100);
 const moved=await page.locator('.hero-landscape').evaluate(el=>getComputedStyle(el).transform);
 if(initial===moved)throw Error('Hero parallax did not respond to scrolling');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.locator('.hero').hover({position:{x:30,y:40}});await page.waitForTimeout(700);
 if(!await page.locator('.hero').evaluate(el=>el.style.getPropertyValue('--landscape-x')))throw Error('Pointer depth inactive');
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const selector of ['.hero-landscape','.role-image img'])if(await page.locator(selector).first().evaluate(el=>getComputedStyle(el).transform)!=='none')throw Error('Reduced motion failed '+selector);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.mouse.move(0,0);await page.waitForTimeout(750);
 await page.screenshot({path:'hero-desktop.png'});
 await page.locator('#opportunities').screenshot({path:'opportunities-preview.png'});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:'hero-mobile.png'});
 console.log('PASS: unique loaded imagery, seven responsive widths, scroll and pointer parallax, and reduced-motion behavior.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
