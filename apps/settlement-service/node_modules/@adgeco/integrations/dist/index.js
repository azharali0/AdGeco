import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
const httpConfig = z.object({ baseUrl: z.string().url(), apiKey: z.string().min(8), webhookSecret: z.string().min(16), provider: z.string().min(2) });
export class HttpPaymentProvider {
    cfg;
    constructor(config) { this.cfg = httpConfig.parse(config); }
    async call(path, body, idempotencyKey) { const response = await fetch(`${this.cfg.baseUrl}${path}`, { method: 'POST', headers: { authorization: `Bearer ${this.cfg.apiKey}`, 'content-type': 'application/json', 'idempotency-key': idempotencyKey }, body: JSON.stringify(body) }); if (!response.ok)
        throw new Error(`PAYMENT_PROVIDER_${response.status}`); return response.json(); }
    async createFunding(input) { const data = await this.call('/funding', input, input.idempotencyKey); return { provider: this.cfg.provider, reference: String(data.reference), status: String(data.status ?? 'PENDING'), data: { checkoutUrl: data.checkoutUrl ? String(data.checkoutUrl) : undefined } }; }
    async refund(input) { const data = await this.call('/refunds', input, input.idempotencyKey); return { provider: this.cfg.provider, reference: String(data.reference), status: String(data.status ?? 'PENDING'), data }; }
    verifyWebhook(input) { const expected = createHmac('sha256', this.cfg.webhookSecret).update(input.rawBody).digest(); const actual = Buffer.from(input.signature, 'hex'); if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
        throw new Error('INVALID_PROVIDER_SIGNATURE'); return JSON.parse(input.rawBody); }
}
export class HttpJsonProvider {
    baseUrl;
    apiKey;
    provider;
    constructor(baseUrl, apiKey, provider) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.provider = provider;
    }
    async post(path, body, idempotencyKey) { const response = await fetch(`${this.baseUrl}${path}`, { method: 'POST', headers: { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json', 'idempotency-key': idempotencyKey }, body: JSON.stringify(body) }); if (!response.ok)
        throw new Error(`${this.provider.toUpperCase()}_${response.status}`); return response.json(); }
    async get(path) { const response = await fetch(`${this.baseUrl}${path}`, { headers: { authorization: `Bearer ${this.apiKey}` } }); if (!response.ok)
        throw new Error(`${this.provider.toUpperCase()}_${response.status}`); return response.json(); }
}
export function requireProductionIntegration(name, value, nodeEnv = process.env.NODE_ENV) { if (nodeEnv === 'production' && !value)
    throw new Error(`MISSING_PRODUCTION_INTEGRATION_${name}`); return value; }
export * from './providers.js';
