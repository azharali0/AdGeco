import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const worker=readFileSync(new URL('../../apps/worker/src/main.ts',import.meta.url),'utf8');
const schema=readFileSync(new URL('../../packages/database/prisma/schema.prisma',import.meta.url),'utf8');
const migration=readFileSync(new URL('../../packages/database/prisma/migrations/20260718235959_adgeco_v1_baseline/migration.sql',import.meta.url),'utf8');
const server=readFileSync(new URL('../../apps/api/src/server.combined.txt',import.meta.url),'utf8');
const launch=readFileSync(new URL('../../infrastructure/kubernetes/launch-platform.yaml',import.meta.url),'utf8');

test('outbox uses database leasing for safe horizontal workers',()=>{
 assert.match(worker,/FOR UPDATE SKIP LOCKED/);
 assert.match(worker,/"lockedBy" = \$1/);
 assert.match(worker,/attempts = attempts \+ 1/);
 assert.match(schema,/lockedAt DateTime\?/);
 assert.match(migration,/"lockedAt" TIMESTAMPTZ/);
});

test('identity lifecycle emits encrypted one-time links',()=>{
 assert.match(server,/verificationTokenEncrypted:encryptSecret/);
 assert.match(server,/resetTokenEncrypted:encryptSecret/);
 assert.match(server,/invitationTokenEncrypted:encryptSecret/);
 assert.match(worker,/decryptSecret/);
 assert.match(worker,/\/verify-email\?token=/);
 assert.match(worker,/\/reset-password\?token=/);
 assert.match(worker,/\/accept-invitation\?token=/);
});

test('launch deployment includes web, migration, ingress and autoscaling',()=>{
 assert.match(launch,/kind: Job/);
 assert.match(launch,/name: adgeco-database-migrate/);
 assert.match(launch,/name: web/);
 assert.match(launch,/kind: Ingress/);
 assert.match(launch,/name: exchange-service/);
 assert.match(launch,/maxReplicas: 50/);
});
