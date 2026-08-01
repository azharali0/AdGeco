import { timingSafeEqual } from 'node:crypto';
export function servicePort(fallback) { return Number(process.env.PORT ?? fallback); }
export function requireServiceToken(value) { const expected = process.env.INTERNAL_SERVICE_TOKEN; if (!expected)
    throw new Error('MISSING_INTERNAL_SERVICE_TOKEN'); if (!value)
    throw new Error('UNAUTHENTICATED_SERVICE'); const a = Buffer.from(value), b = Buffer.from(expected); if (a.length !== b.length || !timingSafeEqual(a, b))
    throw new Error('UNAUTHENTICATED_SERVICE'); }
export function serviceAuthHeader(headers) { return typeof headers['x-adgeco-service-token'] === 'string' ? String(headers['x-adgeco-service-token']) : undefined; }
export function money(value) { const n = Number(value); if (!Number.isFinite(n) || n < 0)
    throw new Error('INVALID_MONEY'); return Number(n.toFixed(6)); }
export function json(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
export async function withSerializableRetry(work, attempts = 3) { let last; for (let i = 0; i < attempts; i++) {
    try {
        return await work();
    }
    catch (error) {
        last = error;
        if (!String(error).includes('P2034'))
            throw error;
        await new Promise(r => setTimeout(r, 25 * (i + 1)));
    }
} throw last; }
