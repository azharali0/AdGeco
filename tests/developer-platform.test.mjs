import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const server=read('apps/api/src/server.combined.txt'),schema=read('packages/database/prisma/schema.prisma'),sdk=read('packages/sdk-web/src/index.ts'),page=read('apps/web/app/developers/page.tsx');
for(const route of ['/v1/developer/openapi','/v1/developer/partners','/v1/developer/webhooks','/v1/developer/sandbox/scenarios','/v1/developer/certifications','/v1/developer/portal']) if(!server.includes(route)) throw new Error(`missing ${route}`);
for(const model of ['PartnerProfile','WebhookEndpoint','WebhookDelivery','IntegrationCertification','SandboxScenario']) if(!schema.includes(`model ${model}`)) throw new Error(`missing ${model}`);
if(!sdk.includes('class AdGecoWebClient')||!sdk.includes('requestAd')) throw new Error('web sdk incomplete');
if(!page.includes('Quick start')||!page.includes('Certification')) throw new Error('developer portal incomplete');
console.log('developer platform verification passed');
