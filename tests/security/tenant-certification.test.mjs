import test from 'node:test';import assert from 'node:assert/strict';import {requireTenant} from '../../packages/runtime-core/src/index.mjs';
const resources=[{id:'p',organisationId:'org-a'},{id:'c',organisationId:'org-b'}];
test('tenant access denies every foreign resource',()=>{for(const resource of resources){assert.doesNotThrow(()=>requireTenant(resource.organisationId,resource.organisationId));assert.throws(()=>requireTenant('attacker',resource.organisationId),/TENANT_BOUNDARY_VIOLATION/);}});
