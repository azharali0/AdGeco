import {readFile,readdir,stat} from 'node:fs/promises';
import {join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const required=['apps/api/src/server.ts','apps/web/lib/api.ts','packages/database/prisma/schema.prisma','docker-compose.yml','infrastructure/kubernetes','infrastructure/terraform','FOUNDER-ENGINEERING-SIGN-OFF.md','REPOSITORY-TRACEABILITY-MATRIX.md','RESIDUAL-EXTERNAL-DEPENDENCY-REGISTER.md'];
for(const item of required){await stat(join(root,item)).catch(()=>{throw new Error(`Missing final artefact: ${item}`)});}
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){if(['node_modules','.git','dist','build','.next'].includes(e.name))continue;const p=join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else out.push(p);}return out;}
const files=await walk(root);const source=files.filter(f=>f.includes('/apps/')||f.includes('/packages/')||f.includes('/infrastructure/')).filter(f=>/\.(ts|tsx|mjs|js|kt|swift|cs|yml|yaml)$/.test(f));
const forbidden=/\b(TODO|FIXME|HACK)\b|throw new Error\(['\"]NOT_IMPLEMENTED|coming soon/i;
const violations=[];for(const f of source){const text=await readFile(f,'utf8');if(forbidden.test(text))violations.push(relative(root,f));}
if(violations.length)throw new Error(`Unresolved implementation markers: ${violations.join(', ')}`);
const api=await readFile(join(root,'apps/api/src/server.ts'),'utf8');for(const token of ['allowedOrigins','ORIGIN_NOT_ALLOWED','SIGTERM','prisma.$disconnect','requestTimeout'])if(!api.includes(token))throw new Error(`API hardening missing: ${token}`);
const web=await readFile(join(root,'apps/web/lib/api.ts'),'utf8');for(const token of ['/v1/auth/refresh','clearSession','logout'])if(!web.includes(token))throw new Error(`Web session lifecycle missing: ${token}`);
const config=await readFile(join(root,'packages/config/src/index.ts'),'utf8');for(const token of ['CONSENT_PROVIDER_KEY','TAX_PROVIDER_KEY','SERVICE_SECRET','allowedOrigins'])if(!config.includes(token))throw new Error(`Production configuration missing: ${token}`);
console.log(JSON.stringify({status:'pass',files:files.length,sourceFiles:source.length,unresolvedMarkers:0,version:'0.90.0'}));
