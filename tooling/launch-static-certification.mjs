import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
const assert=(ok,msg)=>{if(!ok) throw new Error(msg)};
const required=['docker-compose.yml','infrastructure/kubernetes/launch-platform.yaml','infrastructure/kubernetes/domain-services.yaml','infrastructure/kubernetes/production.yaml','infrastructure/terraform/main.tf','infrastructure/observability/prometheus.yml','infrastructure/observability/otel-collector.yaml'];
for(const f of required) assert(existsSync(f),`Missing deployment artefact: ${f}`);
const compose=readFileSync('docker-compose.yml','utf8');
for(const service of ['postgres','redis','migrate','api','worker','web','exchange-service','measurement-service','fraud-service','ledger-service','settlement-service']) assert(new RegExp(`\\n  ${service}:`).test(compose),`Compose workload missing: ${service}`);
const dockerfiles=[];
const walk=(dir)=>{for(const entry of readdirSync(dir)){const f=path.join(dir,entry); if(statSync(f).isDirectory()) walk(f); else if(entry==='Dockerfile') dockerfiles.push(f)}};
walk('apps');
assert(dockerfiles.length>=10,`Expected at least 10 Dockerfiles, found ${dockerfiles.length}`);
for(const f of dockerfiles){const text=readFileSync(f,'utf8'); assert(/FROM\s+node:/i.test(text),`${f} has no Node base image`); assert(/USER\s+node/i.test(text),`${f} does not declare non-root runtime`);}
const k8s=['infrastructure/kubernetes/launch-platform.yaml','infrastructure/kubernetes/domain-services.yaml','infrastructure/kubernetes/production.yaml'].map(f=>readFileSync(f,'utf8')).join('\n');
for(const token of ['Deployment','Service','HorizontalPodAutoscaler','PodDisruptionBudget']) assert(k8s.includes(token),`Kubernetes controls missing: ${token}`);
const tf=readFileSync('infrastructure/terraform/main.tf','utf8');
for(const token of ['aws_db_instance','aws_elasticache','aws_s3_bucket','aws_cloudfront_distribution','aws_kms_key','aws_wafv2_web_acl']) assert(tf.includes(token),`Terraform resource missing: ${token}`);
console.log(`Static deployment certification passed (${dockerfiles.length} Dockerfiles).`);
