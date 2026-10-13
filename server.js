const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = __dirname;
const port = Number(process.env.PORT || 4173);
const allowed = new Set(['/index.html', '/styles.css', '/app.js', '/account.css', '/account.html']);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
http.createServer(async (req,res) => {
  const send = (status,obj) => {res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(obj));};
  let url;
  try {url = new URL(req.url,'http://localhost');} catch {return send(400,{error:'Invalid request.'});}
  if(url.pathname === '/api/enquiries' && req.method === 'POST') {
    if(req.headers.origin && ![`http://localhost:${port}`,`http://127.0.0.1:${port}`].includes(req.headers.origin)) return send(403,{error:'Request origin not allowed.'});
    let body='';
    try {
      for await (const chunk of req) {body+=chunk;if(Buffer.byteLength(body)>12000)return send(413,{error:'Please shorten your message.'});}
      const data=JSON.parse(body);
      const clean = key => typeof data[key]==='string' ? data[key].trim().slice(0,2000) : '';
      const name=clean('name'),phone=clean('phone'),service=clean('service'),email=clean('email');
      if(name.length<2 || !/^(?:\+91[ -]?)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g,'')) || !['Overseas work','Hire manpower','Documentation support','Ticket booking'].includes(service) || data.consent !== true || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return send(400,{error:'Please enter a valid name, Indian mobile number, service, email (if supplied), and consent.'});
      const id='LEON-'+crypto.randomBytes(4).toString('hex').toUpperCase();
      fs.mkdirSync(path.join(root,'data'),{recursive:true});
      fs.appendFileSync(path.join(root,'data','enquiries.jsonl'),JSON.stringify({id,createdAt:new Date().toISOString(),name,phone,email,service,interest:clean('interest'),message:clean('message'),consent:true})+'\n');
      return send(201,{id,message:'Your enquiry is saved in this local preview. It has not been sent to LEON.'});
    } catch {return send(500,{error:'Your enquiry could not be saved. Please try again.'});}
  }
  if(req.method !== 'GET' && req.method !== 'HEAD') return send(405,{error:'Method not allowed.'});
  let pathname;
  try {pathname=decodeURIComponent(url.pathname);} catch {return send(400,{error:'Invalid path.'});}
  if(pathname==='/')pathname='/index.html';
  if(['/sign-in.html','/sign-up.html','/reset-password.html'].includes(pathname))pathname='/account.html';
  if(pathname==='/auth-config.js') {
    try {
      const config = require('./auth-config.cjs')();
      res.writeHead(200, {'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'});
      return res.end(req.method==='HEAD'?undefined:'window.LEON_AUTH = '+JSON.stringify(config)+';');
    } catch { return send(503,{error:'Account configuration is unavailable.'}); }
  }
  if(pathname==='/auth-client.js') {
    return fs.readFile(path.join(root,'dist','auth-client.js'),(err,content)=>{
      if(err)return send(503,{error:'Run npm run build to prepare account access.'});
      res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'});
      res.end(req.method==='HEAD'?undefined:content);
    });
  }
  if(!allowed.has(pathname) && !/^\/assets\/[a-zA-Z0-9_.-]+$/.test(pathname))return send(404,{error:'Not found.'});
  const file=path.join(root,pathname);
  fs.readFile(file,(err,content)=>{if(err)return send(404,{error:'Not found.'});res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:content);});
}).listen(port,'127.0.0.1',()=>console.log(`LEON website: http://localhost:${port}`));
