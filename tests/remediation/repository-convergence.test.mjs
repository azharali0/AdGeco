import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL(`../../${p}`,import.meta.url),'utf8');

test('repository defect register has no open repository defects',()=>{
  const register=JSON.parse(read('REPOSITORY-DEFECT-REGISTER.json'));
  assert.equal(register.summary.open,0);
  assert.ok(register.defects.every(item=>item.status==='CLOSED'));
});

test('canonical runtime topology converges on all core workloads',()=>{
  const compose=read('docker-compose.yml');
  for(const service of ['postgres:','redis:','migrate:','api:','worker:','exchange-service:','measurement-service:','fraud-service:','ledger-service:','settlement-service:','web:']) assert.match(compose,new RegExp(`\\n  ${service}`));
});

test('modern UI policy remains globally enforced',()=>{
  const css=read('apps/web/app/globals.css');
  assert.doesNotMatch(css,/linear-gradient|radial-gradient|conic-gradient/i);
  assert.match(css,/background:\s*#fff|background:\s*white/i);
});
