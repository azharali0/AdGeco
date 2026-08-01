import fs from 'node:fs';
const schema=fs.readFileSync('packages/database/prisma/schema.prisma','utf8');
const server=fs.readFileSync('apps/api/src/server.combined.txt','utf8');
for(const token of ['model TrustInvestigation','model SupportCase','model Incident','model ServiceHealthSnapshot','model ScheduledReport']) if(!schema.includes(token)) throw new Error(`missing ${token}`);
for(const token of ['/v1/operations/command-centre','/v1/operations/investigations','/v1/operations/incidents','/v1/operations/reports']) if(!server.includes(token)) throw new Error(`missing ${token}`);
console.log('operations verification passed');
