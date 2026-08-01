import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const required=['package.json','pnpm-workspace.yaml','packages/database/prisma/schema.prisma','packages/auth/src/index.ts','packages/contracts/src/index.ts','apps/api/src/server.combined.txt','docker-compose.yml','.github/workflows/ci.yml'];
for(const file of required){if(!fs.existsSync(path.join(root,file))) throw new Error(`Missing ${file}`)}
const schema=fs.readFileSync(path.join(root,'packages/database/prisma/schema.prisma'),'utf8');
for(const model of ['User','Organisation','OrganisationMembership','Session','AuditLog','OutboxEvent']) if(!schema.includes(`model ${model}`)) throw new Error(`Missing model ${model}`);
const auth=fs.readFileSync(path.join(root,'packages/auth/src/index.ts'),'utf8');
if(!auth.includes('assertTenant')||!auth.includes('authorise')) throw new Error('RBAC/tenant enforcement missing');
console.log('ADG-004 foundation verification passed');
