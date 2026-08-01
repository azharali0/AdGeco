import Fastify from 'fastify';
import { z } from 'zod';
import { incrementMetric, logger, prometheusMetrics, requestId } from '@adgeco/observability';
import { prisma } from '@adgeco/database';
import { registerOpenRtbRoutes } from './modules/openrtb.js';
import { authRoutes } from './routes/auth.routes.js';
import { organisationsRoutes } from './routes/organisations.routes.js';
import { publishersRoutes } from './routes/publishers.routes.js';
import { advertisersRoutes } from './routes/advertisers.routes.js';
import { exchangeRoutes } from './routes/exchange.routes.js';
import { config } from './shared.js';
const app = Fastify({ logger: false, bodyLimit: 1_048_576, requestTimeout: 15_000, genReqId: (req) => requestId(req.headers['x-request-id']) });
const rateBuckets = new Map();
function enforceRateLimit(req) { const now = Date.now(); const key = `${req.ip}:${(req.routeOptions?.url ?? req.url).split('?')[0]}`; const current = rateBuckets.get(key); if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return;
} current.count += 1; if (current.count > 120)
    throw new Error('RATE_LIMITED'); }
app.options('*', async (req, reply) => { const origin = String(req.headers.origin ?? ''); if (origin && config.allowedOrigins.includes(origin)) {
    reply.header('access-control-allow-origin', origin);
    reply.header('vary', 'origin');
    reply.header('access-control-allow-credentials', 'true');
    reply.header('access-control-allow-methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    reply.header('access-control-allow-headers', 'authorization,content-type,idempotency-key,x-request-id,x-adgeco-delivery-token');
} return reply.code(204).send(); });
app.addHook('onRequest', async (req, reply) => { const origin = String(req.headers.origin ?? ''); if (origin) {
    if (!config.allowedOrigins.includes(origin))
        return reply.code(403).send({ code: 'ORIGIN_NOT_ALLOWED' });
    reply.header('access-control-allow-origin', origin);
    reply.header('vary', 'origin');
    reply.header('access-control-allow-credentials', 'true');
} enforceRateLimit(req); incrementMetric('adgeco_http_requests'); reply.header('x-request-id', req.id); reply.header('cache-control', 'no-store'); reply.header('x-content-type-options', 'nosniff'); reply.header('x-frame-options', 'DENY'); reply.header('referrer-policy', 'strict-origin-when-cross-origin'); reply.header('permissions-policy', 'camera=(), microphone=(), geolocation=()'); reply.header('content-security-policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"); });
app.addHook('onResponse', async (_req, reply) => { incrementMetric(`adgeco_http_responses_${reply.statusCode}`); });
app.get('/metrics', async (_req, reply) => reply.type('text/plain; version=0.0.4').send(prometheusMetrics()));
app.get('/health/live', async () => ({ status: 'ok', service: 'adgeco-api', time: new Date().toISOString() }));
app.get('/health/ready', async (_req, reply) => { try {
    await prisma.$queryRaw `SELECT 1`;
    return { status: 'ok', checks: { database: 'ok' } };
}
catch {
    return reply.code(503).send({ status: 'degraded', checks: { database: 'failed' } });
} });
app.register(authRoutes);
app.register(organisationsRoutes);
app.register(publishersRoutes);
app.register(advertisersRoutes);
app.register(exchangeRoutes);
app.register(async (instance) => {
    await registerOpenRtbRoutes(instance, config.tokenPepper);
});
app.setErrorHandler((error, req, reply) => { const message = error.message; logger.error('request_failed', { requestId: req.id, error: message }); if (message === 'RATE_LIMITED')
    return reply.header('retry-after', '60').code(429).send({ code: message }); if (message === 'UNAUTHENTICATED' || message === 'SESSION_REVOKED' || message === 'INVALID_SESSION' || message === 'INVALID_DELIVERY_TOKEN' || message === 'DELIVERY_TOKEN_EXPIRED')
    return reply.code(401).send({ code: message }); if (message.startsWith('FORBIDDEN') || message === 'TENANT_BOUNDARY_VIOLATION')
    return reply.code(403).send({ code: message }); if (message === 'WEAK_PASSWORD')
    return reply.code(400).send({ code: message, message: 'Password must be at least 12 characters and include uppercase, lowercase, number, and symbol.' }); if (error instanceof z.ZodError)
    return reply.code(400).send({ code: 'VALIDATION_ERROR', issues: error.issues, requestId: req.id }); return reply.code(500).send({ code: 'INTERNAL_ERROR', requestId: req.id }); });
let shuttingDown = false;
async function shutdown(signal) { if (shuttingDown)
    return; shuttingDown = true; logger.info('api_shutdown_started', { signal }); const timeout = setTimeout(() => process.exit(1), 10_000); timeout.unref(); try {
    await app.close();
    await prisma.$disconnect();
    logger.info('api_shutdown_completed', { signal });
    process.exit(0);
}
catch (error) {
    logger.error('api_shutdown_failed', { signal, error: String(error) });
    process.exit(1);
} }
process.once('SIGTERM', () => void shutdown('SIGTERM'));
process.once('SIGINT', () => void shutdown('SIGINT'));
setInterval(() => { const now = Date.now(); for (const [key, value] of rateBuckets)
    if (value.resetAt <= now)
        rateBuckets.delete(key); }, 60_000).unref();
app.listen({ port: config.port, host: '0.0.0.0' }).then(() => logger.info('api_started', { port: config.port, allowedOrigins: config.allowedOrigins })).catch((error) => { logger.error('api_start_failed', { error: String(error) }); process.exit(1); });
