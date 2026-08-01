import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const evidenceDir='certification/production-validation/evidence';
mkdirSync(evidenceDir,{recursive:true});
const checks=[];
function commandAvailable(name){return spawnSync('bash',['-lc',`command -v ${name}`],{encoding:'utf8'}).status===0}
function record(id,status,details={}){checks.push({id,status,...details});}
function run(id,cmd,args=[],required=true){
  const started=new Date().toISOString();
  const result=spawnSync(cmd,args,{encoding:'utf8',env:process.env,maxBuffer:20*1024*1024});
  const output=(result.stdout||'')+(result.stderr||'');
  writeFileSync(`${evidenceDir}/${id}.log`,output);
  const status=result.status===0?'PASS':required?'FAIL':'BLOCKED';
  record(id,status,{command:[cmd,...args].join(' '),exitCode:result.status,started,evidence:`${evidenceDir}/${id}.log`});
  return result.status===0;
}
record('internet-registry',commandAvailable('npm') && spawnSync('npm',['view','pnpm','version','--fetch-timeout=10000'],{encoding:'utf8',timeout:15000}).status===0?'PASS':'BLOCKED',{reason:'Registry access is required for canonical lockfile generation and clean dependency resolution.'});
record('lockfile',existsSync('pnpm-lock.yaml')?'PASS':'BLOCKED',{reason:existsSync('pnpm-lock.yaml')?undefined:'Canonical pnpm-lock.yaml cannot be generated without registry access.'});
run('repository-proof','npm',['run','proof:converged']);
run('native-sdk-proof','bash',['tooling/verify-native-sdks.sh']);
run('source-sbom','node',['tooling/generate-source-sbom.mjs']);
record('docker-engine',commandAvailable('docker')?'AVAILABLE':'BLOCKED',{reason:commandAvailable('docker')?undefined:'Docker engine is not installed in this execution environment.'});
record('kubernetes-client',commandAvailable('kubectl')?'AVAILABLE':'BLOCKED',{reason:commandAvailable('kubectl')?undefined:'kubectl and a target production-like cluster are unavailable.'});
record('postgres-client',commandAvailable('psql')?'AVAILABLE':'BLOCKED',{reason:commandAvailable('psql')?undefined:'psql and a production-equivalent PostgreSQL endpoint are unavailable.'});
record('container-security-tools',commandAvailable('syft')&&commandAvailable('trivy')?'AVAILABLE':'BLOCKED',{reason:commandAvailable('syft')&&commandAvailable('trivy')?undefined:'Resolved image SBOM and vulnerability tools are unavailable.'});
const credentialKeys=['PAYMENT_PROVIDER_URL','PAYMENT_PROVIDER_KEY','PAYOUT_PROVIDER_URL','PAYOUT_PROVIDER_KEY','VERIFICATION_PROVIDER_URL','VERIFICATION_PROVIDER_KEY','CONSENT_PROVIDER_URL','CONSENT_PROVIDER_KEY','TAX_PROVIDER_URL','TAX_PROVIDER_KEY','OBJECT_STORAGE_UPLOAD_URL','OBJECT_STORAGE_PUBLIC_URL'];
const missingCredentials=credentialKeys.filter(k=>!process.env[k]);
record('live-provider-credentials',missingCredentials.length?'BLOCKED':'AVAILABLE',{missing:missingCredentials});
const deviceChecks=[['android-device','ANDROID_SERIAL'],['ios-device','IOS_DEVICE_UDID'],['unity-runtime','UNITY_EDITOR_PATH']];
for(const [id,key] of deviceChecks) record(id,process.env[key]?'AVAILABLE':'BLOCKED',{reason:process.env[key]?undefined:`${key} is not configured.`});
const requiredPass=['repository-proof','native-sdk-proof','source-sbom'];
const hardFailures=checks.filter(c=>c.status==='FAIL');
const blockers=checks.filter(c=>c.status==='BLOCKED');
const report={programme:'ADG-PRODUCTION-VALIDATION-1',generatedAt:new Date().toISOString(),release:'1.1.0-rc.1',result:hardFailures.length?'FAIL':blockers.length?'CONDITIONAL':'PASS',summary:{passed:checks.filter(c=>c.status==='PASS').length,available:checks.filter(c=>c.status==='AVAILABLE').length,blocked:blockers.length,failed:hardFailures.length},checks};
writeFileSync('certification/production-validation/validation-results.json',JSON.stringify(report,null,2)+'\n');
const digest=createHash('sha256').update(JSON.stringify(report)).digest('hex');
writeFileSync('certification/production-validation/evidence/validation-results.sha256',`${digest}  validation-results.json\n`);
console.log(JSON.stringify(report.summary));
if(hardFailures.length) process.exit(1);
