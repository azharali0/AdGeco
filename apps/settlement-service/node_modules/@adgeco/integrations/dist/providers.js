import { createHmac, timingSafeEqual } from 'node:crypto';
export class JsonHttpClient {
    baseUrl;
    apiKey;
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
    async request(path, { method = 'GET', body, idempotencyKey } = {}) { const response = await fetch(`${this.baseUrl}${path}`, { method, headers: { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json', ...(idempotencyKey ? { 'idempotency-key': idempotencyKey } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) }); const text = await response.text(); if (!response.ok)
        throw new Error(`PROVIDER_${response.status}:${text.slice(0, 200)}`); return text ? JSON.parse(text) : {}; }
}
export class HttpPayoutProvider {
    client;
    constructor(baseUrl, apiKey) { this.client = new JsonHttpClient(baseUrl, apiKey); }
    createBeneficiary(input) { return this.client.request('/beneficiaries', { method: 'POST', body: input, idempotencyKey: input.idempotencyKey }); }
    sendPayout(input) { return this.client.request('/payouts', { method: 'POST', body: input, idempotencyKey: input.idempotencyKey }); }
    getPayout(reference) { return this.client.request(`/payouts/${encodeURIComponent(reference)}`); }
}
export class HttpVerificationProvider {
    client;
    constructor(baseUrl, apiKey) { this.client = new JsonHttpClient(baseUrl, apiKey); }
    createBusinessCheck(input) { return this.client.request('/business-checks', { method: 'POST', body: input, idempotencyKey: input.idempotencyKey }); }
    getCheck(reference) { return this.client.request(`/business-checks/${encodeURIComponent(reference)}`); }
}
export class HttpTaxProvider {
    client;
    constructor(baseUrl, apiKey) { this.client = new JsonHttpClient(baseUrl, apiKey); }
    quote(input) { return this.client.request('/tax/quote', { method: 'POST', body: input, idempotencyKey: input.idempotencyKey || `${input.sellerCountry}:${input.buyerCountry}:${input.money.amountMinor}` }); }
}
export class HttpConsentProvider {
    client;
    constructor(baseUrl, apiKey) { this.client = new JsonHttpClient(baseUrl, apiKey); }
    evaluate(input) { return this.client.request('/consent/evaluate', { method: 'POST', body: input }); }
}
export class S3CompatibleStorageProvider {
    endpoint;
    publicBaseUrl;
    constructor(endpoint, publicBaseUrl) {
        this.endpoint = endpoint;
        this.publicBaseUrl = publicBaseUrl;
    }
    async createUpload(input) { const key = encodeURIComponent(input.key); return { uploadUrl: `${this.endpoint}/${key}?expires=${input.expiresInSeconds}`, headers: { 'content-type': input.contentType, 'x-content-sha256': input.checksum }, assetUrl: `${this.publicBaseUrl}/${key}` }; }
    async delete(key) { const response = await fetch(`${this.endpoint}/${encodeURIComponent(key)}`, { method: 'DELETE' }); if (!response.ok)
        throw new Error(`STORAGE_${response.status}`); }
}
export function verifyHmac(rawBody, signature, secret) { const expected = createHmac('sha256', secret).update(rawBody).digest(); const actual = Buffer.from(signature, 'hex'); return actual.length === expected.length && timingSafeEqual(actual, expected); }
