import { existsSync, readFileSync } from 'node:fs';
const failures=[];
if(!existsSync('pnpm-lock.yaml')) failures.push('MISSING_PNPM_LOCKFILE');
const root=JSON.parse(readFileSync('package.json','utf8'));
if(root.packageManager!=='pnpm@10.12.1') failures.push('UNPINNED_PACKAGE_MANAGER');
for(const file of ['pnpm-workspace.yaml','tsconfig.base.json','.github/workflows/ci.yml']) if(!existsSync(file)) failures.push(`MISSING_${file}`);
if(failures.length){console.error(JSON.stringify({status:'blocked',failures},null,2));process.exit(2)}
console.log(JSON.stringify({status:'ready',packageManager:root.packageManager,lockfile:'pnpm-lock.yaml'}));
