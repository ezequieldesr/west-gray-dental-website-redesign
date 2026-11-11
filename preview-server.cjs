// Local-only static preview; deployment uses Vercel's CDN, not this server.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {securityHeaders}=require('./security.cjs');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.woff':'font/woff','.ttf':'font/ttf','.eot':'application/vnd.ms-fontobject','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
function createPreviewServer(root=path.resolve(__dirname,'west-gray-dental/dist')){
return http.createServer((req,res)=>{
  const reply=(status,text)=>{res.writeHead(status,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});res.end(req.method==='HEAD'?'':text)};
  for(const[key,value]of Object.entries(securityHeaders()))res.setHeader(key,value);
  // Do not retain query strings, log URLs, or reflect request values into responses.
  if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');return reply(405,'Method not allowed')}
  let pathname;try{pathname=decodeURIComponent(req.url.split('?')[0]);if(!pathname.startsWith('/')||/[\x00-\x1f\x7f\\]/.test(pathname))return reply(400,'Bad request')}catch{return reply(400,'Bad request')}
  if(pathname.split('/').some(segment=>segment.startsWith('.')||segment==='..'))return reply(404,'Page not found');
  const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep))return reply(404,'Page not found');
  const type=types[path.extname(file).toLowerCase()];if(!type)return reply(404,'Page not found');
  fs.realpath(file,(error,real)=>{if(error||!real.startsWith(root+path.sep))return reply(404,'Page not found');fs.readFile(real,(error,data)=>{if(error)return reply(404,'Page not found');res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data)})});
});
}
module.exports={createPreviewServer};
