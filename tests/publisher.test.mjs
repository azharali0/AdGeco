import assert from 'node:assert/strict';import fs from 'node:fs';
const schema=fs.readFileSync('packages/database/prisma/schema.prisma','utf8');const server=fs.readFileSync('apps/api/src/server.combined.txt','utf8');
for(const model of ['PublisherProfile','PublisherVerification','Property','InventoryPolicy','Placement','SdkRegistration','PublisherPayoutProfile']) assert.match(schema,new RegExp(`model ${model}\\s*\\{`));
for(const route of ['/v1/publishers/:organisationId/profile','/v1/publishers/:organisationId/properties','/v1/properties/:propertyId/placements','/v1/properties/:propertyId/sdk-registrations','/v1/publishers/:organisationId/payout-profile','/v1/publishers/:organisationId/dashboard']) assert.ok(server.includes(route));
assert.ok(server.includes("assertTenant(ctx,organisationId)"));assert.ok(server.includes("encryptSecret(body.accountReference"));console.log('ADG-006 publisher verification passed');
