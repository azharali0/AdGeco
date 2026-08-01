import fs from 'node:fs';
const schema=fs.readFileSync('packages/database/prisma/schema.prisma','utf8');
const server=fs.readFileSync('apps/api/src/server.combined.txt','utf8');
for(const token of ['model SettlementBatch','model SettlementItem','model PayoutAttempt','model PublisherStatement']) if(!schema.includes(token)) throw new Error(`missing ${token}`);
for(const token of ['/v1/settlements/batches','SettlementBatchCreated','PayoutCompleted','withholdingRate']) if(!server.includes(token)) throw new Error(`missing ${token}`);
console.log('settlement verification passed');
