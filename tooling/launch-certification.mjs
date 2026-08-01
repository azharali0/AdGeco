import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const programme='ADG-LAUNCH-CERTIFICATION-1';
const release='1.2.0-launch-candidate.1';
const root=process.cwd();
const base='certification/launch-certification';
const evidence=`${base}/evidence`;
mkdirSync(evidence,{recursive:true});
const gates=[];
const available=(name)=>spawnSync('bash',['-lc',`command -v ${name}`],{encoding:'utf8'}).status===0;
const add=(id,domain,status,details={})=>gates.push({id,domain,status,...details});
const run=(id,domain,cmd,args=[],required=true)=>{
  const startedAt=new Date().toISOString();
  const p=spawnSync(cmd,args,{cwd:root,encoding:'utf8',env:process.env,maxBuffer:40*1024*1024});
  const log=(p.stdout||'')+(p.stderr||'');
  const logPath=`${evidence}/${id}.log`;
  writeFileSync(logPath,log);
  const status=p.status===0?'PASS':required?'FAIL':'BLOCKED';
  add(id,domain,status,{command:[cmd,...args].join(' '),exitCode:p.status,startedAt,evidence:logPath});
  return p.status===0;
};
const block=(id,domain,reason,requiredEvidence=[])=>add(id,domain,'BLOCKED',{reason,requiredEvidence});
const pass=(id,domain,evidencePath,notes)=>add(id,domain,'PASS',{evidence:evidencePath,notes});

// Repository-backed gates.
run('repository-proof','repository','npm',['run','proof:converged']);
run('native-sdk-compiler-proof','sdk','bash',['tooling/verify-native-sdks.sh']);
run('source-sbom','supply-chain','node',['tooling/generate-source-sbom.mjs']);
run('migration-static-integrity','database','node',['tooling/validate-migrations.mjs']);
run('deployment-static-integrity','infrastructure','node',['tooling/launch-static-certification.mjs']);

// Clean-room and supply chain.
if(!existsSync('pnpm-lock.yaml')) block('canonical-lockfile','build','pnpm-lock.yaml is absent and registry DNS is unavailable.', ['pnpm-lock.yaml','clean-install.log']);
else pass('canonical-lockfile','build','pnpm-lock.yaml','Committed canonical lockfile exists.');
const registry=available('npm') && spawnSync('npm',['view','pnpm','version','--fetch-timeout=10000'],{encoding:'utf8',timeout:15000}).status===0;
if(!registry) block('internet-clean-room','build','The execution environment cannot resolve registry.npmjs.org.', ['registry-connectivity.log']);
else add('internet-clean-room','build','AVAILABLE');
block('frozen-install-and-workspace-build','build','Requires registry access and the committed canonical lockfile.', ['frozen-install.log','workspace-build.log','typecheck.log','test.log']);

// Runtime infrastructure.
if(!available('docker')) block('container-build-sign-scan','containers','Docker, cosign, Syft and Trivy are unavailable.', ['image-digests.json','cosign-verify.log','image-sbom.spdx.json','trivy-report.json']);
else add('container-build-sign-scan','containers','AVAILABLE');
if(!available('psql') || !process.env.DATABASE_URL) block('postgres-runtime-certification','database','A production-equivalent PostgreSQL endpoint and psql are unavailable.', ['migration-run.log','concurrency-report.json','rollback-report.json','backup-restore-report.json']);
else add('postgres-runtime-certification','database','AVAILABLE');
if(!available('kubectl') || !process.env.KUBECONFIG) block('kubernetes-multiregion-certification','infrastructure','kubectl, cluster credentials and multi-region targets are unavailable.', ['rollout-report.json','autoscaling-report.json','failover-report.json','dr-report.json']);
else add('kubernetes-multiregion-certification','infrastructure','AVAILABLE');

const providerKeys={
 payments:['PAYMENT_PROVIDER_URL','PAYMENT_PROVIDER_KEY'], payouts:['PAYOUT_PROVIDER_URL','PAYOUT_PROVIDER_KEY'],
 kyb:['VERIFICATION_PROVIDER_URL','VERIFICATION_PROVIDER_KEY'], consent:['CONSENT_PROVIDER_URL','CONSENT_PROVIDER_KEY'],
 tax:['TAX_PROVIDER_URL','TAX_PROVIDER_KEY'], email:['EMAIL_PROVIDER_URL','EMAIL_PROVIDER_KEY'],
 storage:['OBJECT_STORAGE_UPLOAD_URL','OBJECT_STORAGE_PUBLIC_URL'], cdn:['CDN_DISTRIBUTION_ID','CDN_INVALIDATION_ROLE']
};
for(const [provider,keys] of Object.entries(providerKeys)){
 const missing=keys.filter(k=>!process.env[k]);
 if(missing.length) block(`provider-${provider}`,'providers',`Missing required environment variables: ${missing.join(', ')}`, [`${provider}-commissioning-report.json`,`webhook-evidence.log`]);
 else add(`provider-${provider}`,'providers','AVAILABLE');
}

// Device/browser/security/performance/pilot.
if(!process.env.BROWSER_E2E_BASE_URL) block('browser-e2e','experience','A deployed browser test environment is unavailable.', ['playwright-report/index.html']);
else add('browser-e2e','experience','AVAILABLE');
for(const [id,key,artifact] of [['android-real-device','ANDROID_SERIAL','android-device-report.xml'],['ios-real-device','IOS_DEVICE_UDID','ios-device-report.xcresult'],['unity-runtime','UNITY_EDITOR_PATH','unity-test-results.xml']]){
 if(!process.env[key]) block(id,'sdk',`${key} is not configured.`,[artifact]); else add(id,'sdk','AVAILABLE');
}
block('independent-security-certification','security','Independent penetration testing and internet-backed vulnerability databases are unavailable.', ['penetration-test-report.pdf','dependency-audit.json','container-vulnerability-report.json']);
block('load-stress-soak','performance','A deployed production-like environment and traffic generators are unavailable.', ['load-report.json','stress-report.json','soak-report.json']);
block('backup-restore-failover-dr','resilience','Managed database, object storage and multi-region infrastructure are unavailable.', ['backup-restore-report.json','failover-report.json','disaster-recovery-report.json']);
block('controlled-commercial-pilot','pilot','No live pilot publishers, advertisers, approved spend or provider accounts are connected.', ['pilot-participants.json','campaign-delivery-report.json','pilot-reconciliation.json']);
block('financial-reconciliation','finance','Real spend, fees, tax, earnings, settlement and payout evidence is unavailable.', ['financial-reconciliation.json','provider-settlement-statements/']);

const counts={PASS:0,AVAILABLE:0,BLOCKED:0,FAIL:0};
for(const g of gates) counts[g.status]=(counts[g.status]||0)+1;
const decision=counts.FAIL>0?'NO-GO':counts.BLOCKED>0?'CONDITIONAL-NO-GO':'GO';
const report={programme,release,generatedAt:new Date().toISOString(),decision,summary:counts,gates};
writeFileSync(`${base}/launch-certification-results.json`,JSON.stringify(report,null,2)+'\n');
const digest=createHash('sha256').update(JSON.stringify(report)).digest('hex');
writeFileSync(`${evidence}/launch-certification-results.sha256`,`${digest}  launch-certification-results.json\n`);
const md=[`# ${programme} — Final Launch Certification Report`,``,`Release: **${release}**`,`Decision: **${decision}**`,`Generated: ${report.generatedAt}`,``,`## Gate summary`,``,`| Status | Count |`,`|---|---:|`,...Object.entries(counts).map(([k,v])=>`| ${k} | ${v} |`),``,`## Certification gates`,``,`| Gate | Domain | Status | Evidence or reason |`,`|---|---|---|---|`,...gates.map(g=>`| ${g.id} | ${g.domain} | ${g.status} | ${(g.evidence||g.reason||'').replaceAll('|','\\|')} |`),``,`## Certification conclusion`,``,decision==='GO'?'All mandatory launch gates have objective evidence.':'Repository-backed gates passed where available, but launch remains blocked until every BLOCKED gate is executed in the required external environment.',``];
writeFileSync(`${base}/FINAL-LAUNCH-CERTIFICATION-REPORT.md`,md.join('\n'));
console.log(JSON.stringify({decision,summary:counts}));
if(counts.FAIL>0) process.exit(1);
