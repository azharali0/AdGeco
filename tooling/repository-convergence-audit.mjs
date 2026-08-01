import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const skip=new Set(['.git','node_modules','dist','build','.next','coverage']);
const files=[];
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(skip.has(entry.name)) continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full); else files.push(full);
  }
}
walk(root);
const rel=f=>path.relative(root,f).replaceAll('\\','/');
const source=files.filter(f=>/\.(ts|tsx|js|mjs|cjs|json|ya?ml|prisma|css)$/.test(f) && !rel(f).startsWith('tooling/'));
const markers=[];
const marker=/\b(TODO|FIXME|HACK|XXX|NOT_IMPLEMENTED|PLACEHOLDER_IMPLEMENTATION)\b/g;
for(const f of source){
  const r=rel(f);
  if(r==='tooling/repository-convergence-audit.mjs') continue;
  const text=fs.readFileSync(f,'utf8');
  let m; while((m=marker.exec(text))) markers.push({file:r,marker:m[1]});
}
const required=[
  'apps/api/src/server.ts','apps/web/app/page.tsx','apps/worker/src/main.ts',
  'packages/database/prisma/schema.prisma','docker-compose.yml','infrastructure/kubernetes',
  'REPOSITORY-DEFECT-REGISTER.json','REPOSITORY-CONVERGENCE-REPORT.md',
  'REPOSITORY-TRACEABILITY-MATRIX.md','RESIDUAL-EXTERNAL-DEPENDENCY-REGISTER.md'
];
const missing=required.filter(p=>!fs.existsSync(path.join(root,p)));
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
if(!/^1\.(?:[1-9]|[1-9][0-9])\.0-(?:rc|launch-candidate)\.[1-9][0-9]*$/.test(pkg.version)) missing.push('root release-candidate version convergence');
const register=JSON.parse(fs.readFileSync(path.join(root,'REPOSITORY-DEFECT-REGISTER.json'),'utf8'));
if(register.summary.open!==0) missing.push('open repository defects');
if(register.defects.some(d=>d.status!=='CLOSED')) missing.push('non-closed defect entry');
const compose=fs.readFileSync(path.join(root,'docker-compose.yml'),'utf8');
for(const service of ['postgres:','redis:','migrate:','api:','worker:','exchange-service:','measurement-service:','fraud-service:','ledger-service:','settlement-service:','web:']){
  if(!compose.includes(service)) missing.push(`compose service ${service}`);
}
const uiCss=fs.readFileSync(path.join(root,'apps/web/app/globals.css'),'utf8');
if(/linear-gradient|radial-gradient|conic-gradient/i.test(uiCss)) missing.push('gradient declaration');
if(markers.length||missing.length){
  console.error(JSON.stringify({status:'fail',markers,missing},null,2));
  process.exit(1);
}
console.log(JSON.stringify({status:'pass',repositoryFiles:files.length,sourceAndConfigFiles:source.length,openRepositoryDefects:0,version:pkg.version}));
