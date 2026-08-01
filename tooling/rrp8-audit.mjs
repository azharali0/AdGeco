import { existsSync, readFileSync } from 'node:fs';
const required=[
 'packages/platform-runtime/src/provider-runtime.mjs',
 'tests/remediation/rrp8-provider-runtime.test.mjs',
 'tooling/clean-room-preflight.mjs',
 'tooling/external-certification.mjs',
 'tooling/postgres-certification.mjs',
 'certification/ADG-RRP-8-CERTIFICATION-MATRIX.md',
 'certification/EXTERNAL-EVIDENCE-REGISTER.json',
 'docs/runbooks/CONTROLLED-PILOT.md'
];
for(const file of required) if(!existsSync(file)) throw new Error(`RRP8_MISSING:${file}`);
const runtime=readFileSync('packages/platform-runtime/src/provider-runtime.mjs','utf8');
for(const token of ['IDEMPOTENCY_KEY_REQUIRED','AbortController','WebhookReplayGuard','STALE_WEBHOOK','timingSafeEqual']) if(!runtime.includes(token)) throw new Error(`RRP8_RUNTIME_GAP:${token}`);
const compose=readFileSync('docker-compose.yml','utf8');
for(const service of ['postgres:','migrate:','api:','worker:','exchange-service:','measurement-service:','fraud-service:','ledger-service:','settlement-service:','web:']) if(!compose.includes(service)) throw new Error(`RRP8_COMPOSE_GAP:${service}`);
console.log('ADG-RRP-8 repository remediation audit passed');
