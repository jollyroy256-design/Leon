const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {chromium} = require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const html=fs.readFileSync('dist/index.html','utf8');
for(const file of ['server.js','data','check-site.cjs','.git'])assert(!fs.existsSync(path.join('dist',file)),'Private file published: '+file);
for(const match of html.matchAll(/(?:src|href)="(\/(?:assets\/[^"?#]+|styles.css|app.js))"/g))assert(fs.existsSync(path.join('dist',match[1])),'Missing asset '+match[1]);
assert(html.includes('Online enquiries are not connected yet.'));
const handler=require('./api/enquiries');
const server=http.createServer((req,res)=>{
if(req.url==='/api/enquiries')return handler(req,res);
const pathname=new URL(req.url,'http://localhost').pathname;
const file=path.join(process.cwd(),'dist',pathname==='/'?'index.html':pathname);
if(!file.startsWith(path.join(process.cwd(),'dist')+path.sep)){res.writeHead(404);return res.end();}
fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(data);});
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base,{waitUntil:'networkidle'});assert(await page.locator('#booking').isVisible());await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode();})));assert(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth)));
await page.locator('#name').fill('Deployment Test');await page.locator('#phone').fill('9876543210');await page.locator('#consent').check();await page.locator('.submit').click();await page.waitForSelector('#form-status.error');assert((await page.locator('#form-status').textContent()).includes('not been saved'));assert.equal(await page.locator('#name').inputValue(),'Deployment Test');assert.deepEqual(errors,[]);
assert.equal((await fetch(base+'/data/enquiries.jsonl')).status,404);assert.equal((await fetch(base+'/server.js')).status,404);assert.equal((await fetch(base+'/api/enquiries')).status,405);
console.log('PASS: static production homepage, all imagery, calendar, graceful hosted enquiry response with input preservation, and private-file exclusion.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1});
