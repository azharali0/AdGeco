import Fastify from 'fastify';
import { z } from 'zod';
import { prisma } from '@adgeco/database';
import { servicePort, requireServiceToken, serviceAuthHeader } from '@adgeco/service-runtime';
const app = Fastify({ logger: true });
app.addHook('onRequest', async (req) => requireServiceToken(serviceAuthHeader(req.headers)));
app.get('/health/live', async () => ({ status: 'ok', service: 'fraud' }));
app.get('/health/ready', async (_r, reply) => { try {
    await prisma.$queryRaw `SELECT 1`;
    return { status: 'ok' };
}
catch {
    return reply.code(503).send({ status: 'degraded' });
} });
app.post('/v1/assess', async (req, reply) => { const b = z.object({ deliveryId: z.string().uuid(), ipReputation: z.number().min(0).max(100).default(0), userAgent: z.string().default(''), eventsPerMinute: z.number().nonnegative().default(0), duplicate: z.boolean().default(false), clickDelayMs: z.number().int().nonnegative().optional(), evidence: z.record(z.unknown()).default({}) }).parse(req.body); const signals = []; let score = 0; if (b.duplicate) {
    signals.push('DUPLICATE');
    score += 55;
} if (/bot|crawler|spider|headless/i.test(b.userAgent)) {
    signals.push('BOT_UA');
    score += 45;
} if (b.eventsPerMinute > 120) {
    signals.push('VELOCITY');
    score += 35;
} if ((b.clickDelayMs ?? 1000) < 50) {
    signals.push('IMPOSSIBLE_CLICK_DELAY');
    score += 25;
} score = Math.min(100, score + Math.round(b.ipReputation * .25)); const status = score >= 80 ? 'BLOCKED' : score >= 50 ? 'REVIEW' : 'CLEAR'; const row = await prisma.fraudAssessment.create({ data: { deliveryId: b.deliveryId, status, riskScore: score, signals, evidence: b.evidence } }); await prisma.outboxEvent.create({ data: { type: 'FraudAssessmentCompleted', correlationId: row.id, payload: { fraudAssessmentId: row.id, deliveryId: b.deliveryId, status, score } } }); return reply.code(201).send(row); });
app.listen({ port: servicePort(4103), host: '0.0.0.0' });
