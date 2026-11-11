const fs=require('node:fs');
const path=require('node:path');
function siteOrigin(value){
  if(!value)return undefined;
  if(typeof value!=='string'||/[\s<>"'`\\]/.test(value))throw Error('SITE_URL must be a plain HTTPS origin, without credentials, path, query, or fragment');
  let url;try{url=new URL(value)}catch{throw Error('SITE_URL must be a valid HTTPS origin')}
  if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash||url.port||!/^[-a-z0-9.]+$/i.test(url.hostname)||!url.hostname.includes('.')||!([url.origin,url.origin+'/'].includes(value)))throw Error('SITE_URL must be an HTTPS origin without credentials, path, query, fragment, or custom port');
  return url.origin;
}
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jsonForHtml=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
const securityHeaders=()=>Object.fromEntries(require('./vercel.json').headers[0].headers.map(({key,value})=>[key,value]));
function auditPublicFiles(root){
  const top=new Set(['app.js','style.css','motion.css','brand.css','robots.txt','sitemap.xml']);
  const extensions=new Set(['.jpg','.jpeg','.png','.woff','.ttf','.eot','.svg']);
  const walk=directory=>{for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
    const file=path.join(directory,entry.name),relative=path.relative(root,file).split(path.sep).join('/');
    if(entry.isSymbolicLink())throw Error('Symlinks are not allowed in public output');
    if(entry.name.startsWith('.')||/\.(?:env|pem|key|p12|pfx|log|map)$/i.test(entry.name))throw Error('Private or unexpected file in public output');
    if(entry.isDirectory()){if(relative!=='assets'&&!relative.startsWith('assets/'))throw Error('Unexpected public directory');walk(file);continue}
    if(/\.(html|js|css|svg|txt|xml)$/i.test(file)&&/(?:AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:sk_live_|ghp_)[a-zA-Z0-9]{20,})/.test(fs.readFileSync(file,'utf8')))throw Error('Potential credential found in public output');
    if(relative.startsWith('assets/')){
      if(!extensions.has(path.extname(file).toLowerCase()))throw Error('Unexpected public asset type');
      if(path.extname(file).toLowerCase()==='.svg'&&/<script|<foreignObject|\son\w+\s*=|javascript:|<!ENTITY/i.test(fs.readFileSync(file,'utf8')))throw Error('Active content found in SVG asset');
    }else if(!top.has(relative)&&!/^[-a-z0-9]+\.html$/.test(relative))throw Error('Unexpected public file');
  }};walk(root);
}
module.exports={siteOrigin,escapeHtml,jsonForHtml,securityHeaders,auditPublicFiles};
