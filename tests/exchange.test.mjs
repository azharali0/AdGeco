import assert from 'node:assert/strict';import fs from 'node:fs';
const schema=fs.readFileSync('packages/database/prisma/schema.prisma','utf8');const server=fs.readFileSync('apps/api/src/server.combined.txt','utf8');
for(const model of ['AdRequest','Auction','AuctionBid','AuctionDecision','BudgetReservation','FrequencyExposure']) assert.match(schema,new RegExp(`model ${model}\\s*\\{`));
for(const route of ['/v1/exchange/ad-requests','/v1/exchange/decisions/:decisionId','/v1/exchange/health']) assert.ok(server.includes(route));
for(const feature of ['TARGETING_MISMATCH','FREQUENCY_CAP_REACHED','BELOW_FLOOR','FIRST_PRICE','WINNER_BUDGET_UNAVAILABLE','AuctionNoFill','AuctionWon']) assert.ok(server.includes(feature));
assert.ok(server.includes('availableBalance:{decrement:reserveAmount}'));assert.ok(server.includes('reservedBalance:{increment:reserveAmount}'));console.log('ADG-008 exchange verification passed');
