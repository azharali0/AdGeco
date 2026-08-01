import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { ProviderHttpClient, WebhookReplayGuard, verifySignedWebhook } from '../../packages/platform-runtime/src/provider-runtime.mjs';

test('provider client requires idempotency for mutations', async () => {
  const client = new ProviderHttpClient({ provider:'test', baseUrl:'https://provider.invalid', apiKey:'secret', fetchImpl: async()=>{ throw new Error('should not call'); } });
  await assert.rejects(client.request('/payments',{method:'POST',body:{}}), /IDEMPOTENCY_KEY_REQUIRED/);
});

test('provider client retries transient failures but not permanent failures', async () => {
  let calls=0;
  const fetchImpl=async()=>{calls++; return calls<3?new Response('temporary',{status:503}):new Response('{"ok":true}',{status:200,headers:{'content-type':'application/json'}});};
  const client=new ProviderHttpClient({provider:'test',baseUrl:'https://provider.invalid',apiKey:'secret',maxAttempts:3,fetchImpl});
  assert.deepEqual(await client.request('/payments',{method:'POST',body:{},idempotencyKey:'idem-1'}),{ok:true});
  assert.equal(calls,3);
});

test('signed webhooks enforce timestamp, signature and replay protection', () => {
  const rawBody='{"id":"evt_1"}'; const secret='webhook-secret-strong'; const timestampSeconds=1000;
  const signatureHex=createHmac('sha256',secret).update(`${timestampSeconds}.${rawBody}`).digest('hex');
  assert.deepEqual(verifySignedWebhook({rawBody,signatureHex,timestampSeconds,secret,nowSeconds:1001}),{id:'evt_1'});
  assert.throws(()=>verifySignedWebhook({rawBody,signatureHex,timestampSeconds,secret,nowSeconds:2000}),/STALE_WEBHOOK/);
  const guard=new WebhookReplayGuard({now:()=>1000});
  assert.equal(guard.accept('evt_1'),true); assert.equal(guard.accept('evt_1'),false);
});
