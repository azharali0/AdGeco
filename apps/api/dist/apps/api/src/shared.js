import { z } from 'zod';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { loadConfig } from '@adgeco/config';
import { prisma } from '@adgeco/database';
import { tenantRoles } from '@adgeco/contracts';
import { signAccessSession, verifySession } from './auth/session.js';
import { hashToken, randomToken } from '@adgeco/auth';
export const config = loadConfig();
export const email = z.string().email().transform(v => v.trim().toLowerCase());
export const role = z.enum(tenantRoles);
export const orgType = z.enum(['PUBLISHER', 'ADVERTISER', 'AGENCY']);
export const tokenHash = (value) => hashToken(`${config.tokenPepper}:${value}`);
export const deliveryToken = (payload) => { const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url'); const signature = createHmac('sha256', config.tokenPepper).update(encoded).digest('base64url'); return `${encoded}.${signature}`; };
export const verifyDeliveryToken = (token) => { const [encoded, signature] = token.split('.'); if (!encoded || !signature)
    throw new Error('INVALID_DELIVERY_TOKEN'); const expected = createHmac('sha256', config.tokenPepper).update(encoded).digest(); const actual = Buffer.from(signature, 'base64url'); if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw new Error('INVALID_DELIVERY_TOKEN'); const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')); if (payload.exp <= Date.now())
    throw new Error('DELIVERY_TOKEN_EXPIRED'); return payload; };
export const deliveryBearer = (req) => { const header = req.headers.authorization; const candidate = typeof header === 'string' && header.startsWith('Delivery ') ? header.slice(9) : String(req.headers['x-adgeco-delivery-token'] ?? ''); return verifyDeliveryToken(z.string().min(20).parse(candidate)); };
export const bearer = (req) => { const parsed = z.string().regex(/^Bearer\s+\S+$/).safeParse(req.headers.authorization); if (!parsed.success)
    throw new Error('UNAUTHENTICATED'); return parsed.data.slice(7); };
export async function context(req) {
    const claims = await verifySession(bearer(req), config.jwtSecret);
    const session = await prisma.session.findFirst({ where: { id: claims.sessionId, userId: claims.sub, organisationId: claims.organisationId, revokedAt: null, expiresAt: { gt: new Date() } } });
    if (!session)
        throw new Error('SESSION_REVOKED');
    return { requestId: req.id, actorId: claims.sub, organisationId: claims.organisationId, roles: claims.roles, sessionId: session.id };
}
export async function rolesFor(userId, organisationId) { const rows = await prisma.organisationMembership.findMany({ where: { userId, organisationId, status: 'ACTIVE' }, select: { role: true } }); return rows.map(r => r.role).filter((r) => tenantRoles.includes(r)); }
export async function audit(args) { await prisma.auditLog.create({ data: { organisationId: args.organisationId, actorId: args.actorId, action: args.action, entityType: args.entityType, entityId: args.entityId, requestId: args.requestId, metadata: (args.metadata ?? {}) } }); }
export async function event(type, organisationId, payload, correlationId) { await prisma.outboxEvent.create({ data: { organisationId, type, correlationId, payload: payload } }); }
export async function issueSession(userId, organisationId, roles, req) { const refresh = randomToken(48); const session = await prisma.session.create({ data: { userId, organisationId, refreshTokenHash: tokenHash(refresh), userAgent: req.headers['user-agent'], ipAddress: req.ip, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }); const accessToken = await signAccessSession({ sub: userId, organisationId, roles, sessionId: session.id }, config.jwtSecret); return { accessToken, refreshToken: refresh, expiresIn: 900, sessionId: session.id }; }
