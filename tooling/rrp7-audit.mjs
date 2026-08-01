import fs from 'node:fs';
const required=['packages/platform-runtime/src/index.mjs','tests/remediation/platform-runtime.test.mjs','docs/runbooks/PRODUCTION-COMMISSIONING.md','docs/REMEDIATION-STATUS.md'];
for(const file of required)if(!fs.existsSync(file))throw new Error(`MISSING:${file}`);
const compose=fs.readFileSync('docker-compose.yml','utf8');for(const service of ['api:','worker:','exchange-service:','measurement-service:','fraud-service:','ledger-service:','settlement-service:','web:'])if(!compose.includes(service))throw new Error(`COMPOSE_MISSING:${service}`);
const api=fs.readFileSync('apps/api/src/server.ts','utf8');for(const marker of ['bodyLimit:1_048_576','RATE_LIMITED','content-security-policy','permissions-policy'])if(!api.includes(marker))throw new Error(`API_HARDENING_MISSING:${marker}`);
for(const file of ['apps/api/Dockerfile','apps/worker/Dockerfile']){const value=fs.readFileSync(file,'utf8');if(!value.includes(' AS build')||!value.includes('USER node'))throw new Error(`CONTAINER_HARDENING_MISSING:${file}`)}
console.log('ADG-RRP-7 remediation audit passed');
