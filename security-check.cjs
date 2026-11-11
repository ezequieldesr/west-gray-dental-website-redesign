const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {auditPublicFiles,securityHeaders}=require('./security.cjs');
const config=require('./vercel.json'),pkg=require('./package.json'),root=path.join(__dirname,config.outputDirectory);
assert.equal(config.framework,null);assert.equal(config.outputDirectory,'west-gray-dental/dist');
assert(!pkg.dependencies&&!pkg.devDependencies,'Review dependencies before changing the zero-dependency baseline');
auditPublicFiles(root);
const headers=securityHeaders(),csp=headers['Content-Security-Policy'];
for(const rule of ["default-src 'none'","script-src 'self'","script-src-attr 'none'","style-src 'self'","style-src-attr 'none'","object-src 'none'","base-uri 'none'","form-action 'none'","frame-ancestors 'none'","connect-src 'none'"])assert(csp.split(';').map(s=>s.trim()).includes(rule),`Missing CSP rule: ${rule}`);
assert(!/unsafe-inline|unsafe-eval|\*/.test(csp));
assert.equal(headers['X-Content-Type-Options'],'nosniff');assert.equal(headers['X-Frame-Options'],'DENY');assert.equal(headers['Referrer-Policy'],'no-referrer');
let forms=0;
for(const file of fs.readdirSync(root).filter(name=>name.endsWith('.html'))){const html=fs.readFileSync(path.join(root,file),'utf8');assert(!/\son[a-z]+\s*=|<base\b|javascript:|<style\b|\sstyle\s*=/i.test(html),`${file}: unsafe inline content`);for(const tag of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(tag[1].includes('application/ld+json')){JSON.parse(tag[2]);continue}assert(/src="app\.js"/.test(tag[1])&&!tag[2].trim(),`${file}: unexpected executable script`)}for(const match of html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)){forms++;assert(/method="post"/.test(match[0]),'Forms must never use GET');assert(/type="submit" disabled/.test(match[0]),'Submission must fail closed without JS');assert(/Please.*sensitive|sensitive medical/i.test(html),'Missing health-information notice')}assert(!/<iframe\b/.test(html),'Maps must not load before consent');assert(!/(?:AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:sk_live_|ghp_)[a-zA-Z0-9]{20,})/.test(html),'Potential credential in build')}
assert.equal(forms,2);
console.log('Security checks passed: strict CSP, deployment output allowlist, no active inline code or exposed credential patterns in HTML, fail-closed POST forms, and opt-in maps.');
