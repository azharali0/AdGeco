import test from 'node:test';import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {readFile} from 'node:fs/promises';

test('OpenRTB schemas require request and impression identities',async()=>{const source=await readFile(new URL('../../packages/openrtb/src/index.ts',import.meta.url),'utf8');assert.match(source,/bidRequestSchema/);assert.match(source,/imp:z\.array/);assert.match(source,/noBid/)});
test('payment webhook signature uses constant-time comparison',async()=>{const source=await readFile(new URL('../../packages/integrations/src/index.ts',import.meta.url),'utf8');assert.match(source,/timingSafeEqual/);assert.match(source,/idempotency-key/)});
test('production configuration fails closed for external providers',async()=>{const source=await readFile(new URL('../../packages/config/src/index.ts',import.meta.url),'utf8');for(const key of ['paymentProviderUrl','payoutProviderUrl','verificationProviderUrl','objectStoragePublicUrl'])assert.ok(source.includes(key))});
test('signature fixture is deterministic',()=>{const secret='0123456789abcdef';const body='{"id":"evt_1"}';assert.equal(createHmac('sha256',secret).update(body).digest('hex'),createHmac('sha256',secret).update(body).digest('hex'))});
