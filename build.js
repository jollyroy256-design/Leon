const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, 'dist');
fs.mkdirSync(output, {recursive:true});
// Publish only public assets, never the local server, enquiry data or tooling.
for (const name of ['styles.css', 'app.js', 'account.css']) fs.copyFileSync(path.join(__dirname,name),path.join(output,name));
fs.cpSync(path.join(__dirname,'assets'),path.join(output,'assets'),{recursive:true});
let html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
html = html.replace('Preview: enquiries save locally. Email and WhatsApp aren’t connected yet.', 'Online enquiries are not connected yet. Your details will not be submitted.');
html = html.replace("Preview: enquiries save locally. Email and WhatsApp aren't connected yet.", 'Online enquiries are not connected yet. Your details will not be submitted.');
html = html.replace('Request only, subject to confirmation. This preview saves locally; no appointment is reserved.', 'Choose a preferred date to plan your enquiry. Online booking is not connected; no appointment is reserved.');
html = html.replace('This local preview saves your name, contact details, selected service, and message to a file on the computer running the website. The form does not send an email or WhatsApp message.', 'Online enquiry delivery is not connected on this website. The form does not save your details, send an email or WhatsApp message, or reserve an appointment.');
fs.writeFileSync(path.join(output,'index.html'),html);
for (const name of ['account.html','sign-in.html','sign-up.html','reset-password.html']) {
  fs.copyFileSync(path.join(__dirname,'account.html'),path.join(output,name));
}
require('esbuild').buildSync({entryPoints:[path.join(__dirname,'auth-client.js')],bundle:true,minify:true,platform:'browser',target:['es2020'],outfile:path.join(output,'auth-client.js')});
const authConfig = require('./auth-config.cjs')();
fs.writeFileSync(path.join(output,'auth-config.js'),'window.LEON_AUTH = '+JSON.stringify(authConfig)+';');
console.log('Built static website in dist/; account service '+(authConfig.enabled?'configured':'not configured')+'.');
