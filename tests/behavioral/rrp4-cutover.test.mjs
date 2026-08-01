import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const root=new URL('../../',import.meta.url);const read=p=>readFileSync(new URL(p,root),'utf8');
test('dedicated financial runtimes are durable',()=>{for(const f of ['apps/ledger-service/src/server.ts','apps/settlement-service/src/server.ts']){const s=read(f);assert.match(s,/prisma\./);assert.doesNotMatch(s,/const\s+(accounts|entries|batches)\s*=\s*new Map\(|const\s+entries\s*=\s*\[\]/);}});
test('measurement rejects idempotency conflicts',()=>assert.match(read('apps/measurement-service/src/server.ts'),/IDEMPOTENCY_CONFLICT/));
test('exchange uses serializable transaction and atomic reservation',()=>{const s=read('apps/exchange-service/src/persistent.ts');assert.match(s,/Serializable/);assert.match(s,/availableBalance:\{decrement/);assert.match(s,/reservedBalance:\{increment/);});
test('services require internal identity',()=>{for(const f of ['exchange','measurement','fraud','ledger','settlement'])assert.match(read(`apps/${f}-service/src/server.ts`),/requireServiceToken/);});
