import Fastify from 'fastify';
import { z } from 'zod';
import { prisma, Prisma } from '@adgeco/database';
import { HttpPayoutProvider } from '@adgeco/integrations';
import { servicePort, requireServiceToken, serviceAuthHeader } from '@adgeco/service-runtime';
const app = Fastify({ logger: true });
app.addHook('onRequest', async (req) => requireServiceToken(serviceAuthHeader(req.headers)));
app.get('/health/live', async () => ({ status: 'ok', service: 'settlement' }));
app.get('/health/ready', async (_r, reply) => { try {
    await prisma.$queryRaw `SELECT 1`;
    return { status: 'ok' };
}
catch {
    return reply.code(503).send({ status: 'degraded' });
} });
app.post('/v1/batches', async (req, reply) => { const b = z.object({ publisherOrganisationId: z.string().uuid(), periodStart: z.coerce.date(), periodEnd: z.coerce.date(), currency: z.string().length(3), withholdingRate: z.number().min(0).max(1).default(0) }).parse(req.body); const earnings = await prisma.publisherEarning.findMany({ where: { publisherOrganisationId: b.publisherOrganisationId, currency: b.currency, settledAt: null, availableAt: { lte: new Date() }, createdAt: { gte: b.periodStart, lte: b.periodEnd } } }); if (!earnings.length)
    return reply.code(422).send({ code: 'NO_ELIGIBLE_EARNINGS' }); const gross = earnings.reduce((s, e) => s + Number(e.amount), 0), withholding = Number((gross * b.withholdingRate).toFixed(6)), net = Number((gross - withholding).toFixed(6)); const batch = await prisma.$transaction(async (tx) => { const created = await tx.settlementBatch.create({ data: { publisherOrganisationId: b.publisherOrganisationId, periodStart: b.periodStart, periodEnd: b.periodEnd, currency: b.currency, grossAmount: new Prisma.Decimal(gross), withholdingAmount: new Prisma.Decimal(withholding), netAmount: new Prisma.Decimal(net), status: 'SCHEDULED' } }); await tx.settlementItem.createMany({ data: earnings.map(e => ({ batchId: created.id, publisherOrganisationId: b.publisherOrganisationId, publisherEarningId: e.id, grossAmount: e.amount, withholdingAmount: new Prisma.Decimal(Number(e.amount) * b.withholdingRate), netAmount: new Prisma.Decimal(Number(e.amount) * (1 - b.withholdingRate)), currency: b.currency, status: 'PENDING' })) }); await tx.outboxEvent.create({ data: { organisationId: b.publisherOrganisationId, type: 'SettlementBatchReady', correlationId: created.id, payload: { batchId: created.id, gross, withholding, net } } }); return created; }); return reply.code(201).send(batch); });
app.post('/v1/batches/:id/submit', async (req, reply) => { const { id } = z.object({ id: z.string().uuid() }).parse(req.params); const b = z.object({ beneficiaryReference: z.string().min(3), statementReference: z.string().min(3) }).parse(req.body); const batch = await prisma.settlementBatch.findUnique({ where: { id }, include: { items: true, publisherOrganisation: true } }); if (!batch || batch.status !== 'SCHEDULED')
    return reply.code(409).send({ code: 'BATCH_NOT_READY' }); const url = process.env.PAYOUT_PROVIDER_URL, key = process.env.PAYOUT_PROVIDER_KEY; if (!url || !key)
    return reply.code(503).send({ code: 'PAYOUT_PROVIDER_NOT_CONFIGURED' }); const provider = new HttpPayoutProvider(url, key); const result = await provider.sendPayout({ idempotencyKey: `settlement:${id}`, beneficiaryReference: b.beneficiaryReference, money: { amountMinor: Math.round(Number(batch.netAmount) * 100), currency: batch.currency }, statementReference: b.statementReference }); const attempt = await prisma.$transaction(async (tx) => { const a = await tx.payoutAttempt.create({ data: { settlementItemId: batch.items[0].id, provider: 'http', providerReference: String(result.reference), idempotencyKey: `settlement:${id}`, status: 'SUBMITTED', amount: batch.netAmount, currency: batch.currency, attemptNumber: 1 } }); await tx.settlementBatch.update({ where: { id }, data: { status: 'PROCESSING' } }); return a; }); return reply.code(202).send(attempt); });
app.listen({ port: servicePort(4105), host: '0.0.0.0' });
