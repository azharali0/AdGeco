import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const manifests = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (['node_modules','.git','dist','build','.next'].includes(name)) continue;
    const path = join(dir,name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (name === 'package.json') manifests.push(path);
  }
}
walk(root);
const packages=[];
const relationships=[];
for (const file of manifests.sort()) {
  const pkg=JSON.parse(readFileSync(file,'utf8'));
  const ref=`pkg:npm/${encodeURIComponent(pkg.name || relative(root,file))}@${pkg.version || '0.0.0'}`;
  packages.push({SPDXID:`SPDXRef-${Buffer.from(ref).toString('hex').slice(0,24)}`,name:pkg.name||relative(root,file),versionInfo:pkg.version||'0.0.0',downloadLocation:'NOASSERTION',filesAnalyzed:false,externalRefs:[{referenceCategory:'PACKAGE-MANAGER',referenceType:'purl',referenceLocator:ref}],supplier:'NOASSERTION'});
  for (const group of ['dependencies','devDependencies','optionalDependencies','peerDependencies']) {
    for (const [name,version] of Object.entries(pkg[group]||{})) relationships.push({source:pkg.name||relative(root,file),dependency:name,declaredVersion:version,scope:group});
  }
}
const document={spdxVersion:'SPDX-2.3',dataLicense:'CC0-1.0',SPDXID:'SPDXRef-DOCUMENT',name:'AdGeco source dependency SBOM',documentNamespace:`https://adgeco.invalid/spdx/source-${Date.now()}`,creationInfo:{created:new Date().toISOString(),creators:['Tool: adgeco-generate-source-sbom']},packages,annotations:[{annotationDate:new Date().toISOString(),annotationType:'OTHER',annotator:'Tool: adgeco-generate-source-sbom',comment:'Source-manifest SBOM only. Resolved transitive versions require a registry-backed frozen installation.'}],declaredRelationships:relationships};
writeFileSync('certification/production-validation/reports/source-sbom.spdx.json',JSON.stringify(document,null,2)+'\n');
console.log(JSON.stringify({status:'pass',manifests:manifests.length,declaredDependencies:relationships.length,output:'certification/production-validation/reports/source-sbom.spdx.json'}));
