import assert from 'node:assert/strict';import fs from 'node:fs';
const schema=fs.readFileSync('packages/database/prisma/schema.prisma','utf8');const server=fs.readFileSync('apps/api/src/server.combined.txt','utf8');
for(const model of ['AdDelivery','DeliveryMeasurementEvent','VideoPlaybackEvent']) assert.match(schema,new RegExp(`model ${model}\\s*\\{`));
for(const route of ['/v1/ad-serving/deliveries/:deliveryId/asset','/v1/ad-serving/deliveries/:deliveryId/render','/v1/ad-serving/deliveries/:deliveryId/impression','/v1/ad-serving/deliveries/:deliveryId/click','/v1/ad-serving/deliveries/:deliveryId/playback','/v1/ad-serving/deliveries/:deliveryId/failure']) assert.ok(server.includes(route));
for(const feature of ['CreativeDeliveryIssued','CreativeRendered','ImpressionQualified','ClickValidated','VideoPlaybackRecorded','CreativeDeliveryFailed','RENDER_NOT_VERIFIED','DELIVERY_TOKEN_EXPIRED']) assert.ok(server.includes(feature));
assert.ok(server.includes("status:'CHARGED'"));assert.ok(server.includes("status:'RELEASED'"));console.log('ADG-009 ad serving verification passed');
