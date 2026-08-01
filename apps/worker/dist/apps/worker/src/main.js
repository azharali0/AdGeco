import { createHmac } from 'node:crypto';
import { prisma } from '@adgeco/database';
import { decryptSecret } from '@adgeco/auth';
import { logger } from '@adgeco/observability';
import { ConsoleEmailProvider, HttpEmailProvider } from '@adgeco/email';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const workerId = process.env.WORKER_ID ?? `worker-${process.pid}`;
const tokenPepper = process.env.TOKEN_PEPPER ?? '';
const publicAppUrl = (process.env.PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const emailProvider = process.env.EMAIL_API_URL && process.env.EMAIL_API_KEY && process.env.EMAIL_FROM
    ? new HttpEmailProvider(process.env.EMAIL_API_URL, process.env.EMAIL_API_KEY, process.env.EMAIL_FROM)
    : new ConsoleEmailProvider();
async function deliverWebhook(delivery) {
    const timestamp = Date.now().toString();
    const body = JSON.stringify(delivery.payload);
    const signature = createHmac('sha256', delivery.endpoint.secretHash).update(`${timestamp}.${body}`).digest('hex');
    const response = await fetch(delivery.endpoint.url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-adgeco-event': delivery.eventType, 'x-adgeco-timestamp': timestamp, 'x-adgeco-signature': signature, 'x-adgeco-delivery-id': delivery.id }, body, signal: AbortSignal.timeout(10_000) });
    if (!response.ok)
        throw new Error(`WEBHOOK_HTTP_${response.status}`);
    await prisma.webhookDelivery.update({ where: { id: delivery.id }, data: { status: 'DELIVERED', attempts: { increment: 1 }, deliveredAt: new Date(), lastError: null } });
}
async function processWebhooks() {
    const rows = await prisma.webhookDelivery.findMany({ where: { status: { in: ['PENDING', 'RETRYING'] }, OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: new Date() } }] }, include: { endpoint: true }, take: 50, orderBy: { createdAt: 'asc' } });
    for (const row of rows) {
        try {
            await deliverWebhook(row);
        }
        catch (error) {
            const attempts = row.attempts + 1;
            await prisma.webhookDelivery.update({ where: { id: row.id }, data: { status: attempts >= 8 ? 'FAILED' : 'RETRYING', attempts, lastError: String(error), nextAttemptAt: new Date(Date.now() + Math.min(3600, 2 ** attempts * 5) * 1000) } });
        }
    }
}
async function claimOutbox() {
    return prisma.$queryRawUnsafe(`
  WITH candidates AS (
    SELECT id FROM "OutboxEvent"
    WHERE status = 'PENDING'
      AND "availableAt" <= NOW()
      AND ("lockedAt" IS NULL OR "lockedAt" < NOW() - INTERVAL '5 minutes')
    ORDER BY "createdAt" ASC
    LIMIT 100
    FOR UPDATE SKIP LOCKED
  )
  UPDATE "OutboxEvent" event
  SET "lockedAt" = NOW(), "lockedBy" = $1, attempts = attempts + 1
  FROM candidates
  WHERE event.id = candidates.id
  RETURNING event.id, event."organisationId", event.type, event.payload, event.attempts
 `, workerId);
}
async function dispatchEmail(row) {
    if (typeof row.payload !== 'object' || !row.payload)
        return;
    const payload = row.payload;
    if (typeof payload.email !== 'string')
        return;
    if (!tokenPepper)
        throw new Error('TOKEN_PEPPER_REQUIRED');
    if (row.type === 'UserRegistered') {
        if (typeof payload.verificationTokenEncrypted !== 'string')
            throw new Error('EMAIL_VERIFICATION_PAYLOAD_INCOMPLETE');
        const token = decryptSecret(payload.verificationTokenEncrypted, tokenPepper);
        const url = `${publicAppUrl}/verify-email?token=${encodeURIComponent(token)}`;
        await emailProvider.send({ to: payload.email, subject: 'Verify your AdGeco email', text: `Verify your AdGeco account: ${url}`, html: `<p>Verify your AdGeco account:</p><p><a href="${url}">Verify email</a></p>`, idempotencyKey: row.id });
    }
    if (row.type === 'PasswordResetRequested') {
        if (typeof payload.resetTokenEncrypted !== 'string')
            throw new Error('PASSWORD_RESET_PAYLOAD_INCOMPLETE');
        const token = decryptSecret(payload.resetTokenEncrypted, tokenPepper);
        const url = `${publicAppUrl}/reset-password?token=${encodeURIComponent(token)}`;
        await emailProvider.send({ to: payload.email, subject: 'Reset your AdGeco password', text: `Reset your password: ${url}`, html: `<p>Reset your AdGeco password:</p><p><a href="${url}">Reset password</a></p>`, idempotencyKey: row.id });
    }
    if (row.type === 'OrganisationInvitationCreated') {
        if (typeof payload.invitationTokenEncrypted !== 'string')
            throw new Error('INVITATION_PAYLOAD_INCOMPLETE');
        const token = decryptSecret(payload.invitationTokenEncrypted, tokenPepper);
        const url = `${publicAppUrl}/accept-invitation?token=${encodeURIComponent(token)}`;
        await emailProvider.send({ to: payload.email, subject: 'You have been invited to AdGeco', text: `Accept your invitation: ${url}`, html: `<p>You have been invited to AdGeco.</p><p><a href="${url}">Accept invitation</a></p>`, idempotencyKey: row.id });
    }
}
async function processOutbox() {
    const rows = await claimOutbox();
    for (const row of rows) {
        try {
            const endpoints = await prisma.webhookEndpoint.findMany({ where: { organisationId: row.organisationId ?? undefined, status: 'ACTIVE', eventTypes: { has: row.type } } });
            for (const endpoint of endpoints)
                await prisma.webhookDelivery.upsert({ where: { endpointId_eventId: { endpointId: endpoint.id, eventId: row.id } }, create: { endpointId: endpoint.id, eventId: row.id, eventType: row.type, payload: row.payload, status: 'PENDING', nextAttemptAt: new Date() }, update: {} });
            await dispatchEmail(row);
            await prisma.outboxEvent.update({ where: { id: row.id }, data: { status: 'PUBLISHED', publishedAt: new Date(), lockedAt: null, lockedBy: null, lastError: null } });
        }
        catch (error) {
            const terminal = row.attempts >= 10;
            await prisma.outboxEvent.update({ where: { id: row.id }, data: { status: terminal ? 'FAILED' : 'PENDING', availableAt: new Date(Date.now() + Math.min(3600, 2 ** row.attempts * 5) * 1000), lockedAt: null, lockedBy: null, lastError: String(error) } });
            logger.error('outbox_processing_failed', { workerId, eventId: row.id, terminal, error: String(error) });
        }
    }
}
async function expireReservations() { await prisma.budgetReservation.updateMany({ where: { status: 'RESERVED', expiresAt: { lt: new Date() } }, data: { status: 'EXPIRED' } }); }
async function heartbeat() { await prisma.serviceHealthSnapshot.create({ data: { service: 'worker-runtime', region: process.env.REGION ?? 'local', status: 'HEALTHY', details: { workerId }, observedAt: new Date() } }).catch(() => undefined); }
async function main() { logger.info('worker_started', { workerId }); while (true) {
    await Promise.allSettled([processOutbox(), processWebhooks(), expireReservations(), heartbeat()]);
    await sleep(Number(process.env.WORKER_POLL_MS ?? 1000));
} }
main().catch(error => { logger.error('worker_fatal', { error: String(error) }); process.exit(1); });
