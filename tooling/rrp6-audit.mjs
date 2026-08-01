import {existsSync,readFileSync} from 'node:fs';
const required=[
 'apps/web/app/signup/page.tsx','apps/web/app/verify-email/page.tsx','apps/web/app/forgot-password/page.tsx','apps/web/app/reset-password/page.tsx','apps/web/app/accept-invitation/page.tsx',
 'apps/web/Dockerfile','infrastructure/kubernetes/launch-platform.yaml','docs/ADG-RRP-6-LAUNCH-NEARNESS.md','docs/GLOBAL-LAUNCH-GAP-REGISTER.md'
];
for(const file of required)if(!existsSync(new URL(`../${file}`,import.meta.url)))throw new Error(`Missing RRP-6 artefact: ${file}`);
const worker=readFileSync(new URL('../apps/worker/src/main.ts',import.meta.url),'utf8');
for(const evidence of ['FOR UPDATE SKIP LOCKED','PasswordResetRequested','OrganisationInvitationCreated','verificationTokenEncrypted'])if(!worker.includes(evidence))throw new Error(`Missing worker evidence: ${evidence}`);
console.log('ADG-RRP-6 launch-nearness audit passed');
