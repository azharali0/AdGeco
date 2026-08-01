import Fastify from 'fastify';
import { z } from 'zod';
import { prisma } from '@adgeco/database';
import { servicePort, requireServiceToken, serviceAuthHeader } from '@adgeco/service-runtime';
const app = Fastify({ logger: true });
app.addHook('onRequest', async (req) => requireServiceToken(serviceAuthHeader(req.headers)));
app.get('/health/live', async () => ({ status: 'ok', service: 'measurement' }));
app.get('/health/ready', async (_r, reply) => { try {
    await prisma.$queryRaw `SELECT 1`;
    return { status: 'ok' };
}
catch {
    return reply.code(503).send({ status: 'degraded' });
} });
app.post('/v1/events', async (req, reply) => { const b = z.object({ deliveryId: z.string().uuid(), eventKey: z.string().min(8), eventType: z.enum(['ASSET_RESOLVED', 'RENDER_STARTED', 'RENDER_SUCCEEDED', 'IMPRESSION', 'VIEWABLE', 'CLICK', 'VIDEO_START', 'VIDEO_FIRST_QUARTILE', 'VIDEO_MIDPOINT', 'VIDEO_THIRD_QUARTILE', 'VIDEO_COMPLETE', 'DELIVERY_FAILED']), occurredAt: z.coerce.date(), evidence: z.record(z.unknown()).default({}) }).parse(req.body); const existing = await prisma.deliveryMeasurementEvent.findUnique({ where: { eventKey: b.eventKey } }); if (existing) {
    if (existing.deliveryId !== b.deliveryId || existing.eventType !== b.eventType)
        return reply.code(409).send({ code: 'IDEMPOTENCY_CONFLICT' });
    return existing;
} const event = await prisma.deliveryMeasurementEvent.create({ data: { ...b, evidence: b.evidence } }); await prisma.outboxEvent.create({ data: { type: 'MeasurementEventAccepted', correlationId: b.eventKey, payload: { measurementEventId: event.id, deliveryId: b.deliveryId, eventType: b.eventType } } }); return reply.code(201).send(event); });
app.post('/v1/viewability', async (req, reply) => { const b = z.object({ deliveryId: z.string().uuid(), visiblePercentage: z.number().min(0).max(100), durationMs: z.number().int().nonnegative(), viewportWidth: z.number().int().positive().optional(), viewportHeight: z.number().int().positive().optional(), tabFocused: z.boolean().default(true) }).parse(req.body); const qualified = b.tabFocused && b.visiblePercentage >= 50 && b.durationMs >= 1000; const row = await prisma.viewabilityAssessment.create({ data: { ...b, qualified, ruleVersion: 'mrc-display-v1' } }); return reply.code(201).send(row); });
app.post('/v1/conversions', async (req, reply) => { const b = z.object({ deliveryId: z.string().uuid(), eventKey: z.string().min(8), conversionType: z.string().min(1), value: z.number().nonnegative().optional(), currency: z.string().length(3).optional(), occurredAt: z.coerce.date(), metadata: z.record(z.unknown()).default({}) }).parse(req.body); const existing = await prisma.conversionEvent.findUnique({ where: { eventKey: b.eventKey } }); if (existing)
    return existing; const conversion = await prisma.conversionEvent.create({ data: { ...b, metadata: b.metadata } }); const delivery = await prisma.adDelivery.findUnique({ where: { id: b.deliveryId }, include: { events: true } }); const click = delivery?.events.filter(e => e.eventType === 'CLICK' && e.occurredAt <= b.occurredAt).sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())[0]; const impression = delivery?.events.filter(e => e.eventType === 'IMPRESSION' && e.occurredAt <= b.occurredAt).sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())[0]; const attributed = Boolean(click || impression); const attribution = await prisma.attributionRecord.create({ data: { deliveryId: b.deliveryId, conversionEventId: conversion.id, model: click ? 'LAST_CLICK' : 'LAST_VIEW', attributed, confidence: click ? 1 : impression?.occurredAt && b.occurredAt.getTime() - impression.occurredAt.getTime() <= 24 * 60 * 60 * 1000 ? 0.7 : 0, evidence: { clickEventId: click?.id, impressionEventId: impression?.id } } }); return reply.code(201).send({ conversion, attribution }); });
app.listen({ port: servicePort(4102), host: '0.0.0.0' });
