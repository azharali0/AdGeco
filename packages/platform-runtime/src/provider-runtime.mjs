import { createHmac, timingSafeEqual } from 'node:crypto';

export class ProviderHttpError extends Error {
  constructor(provider, status, retryable, detail = '') {
    super(`${provider.toUpperCase()}_${status}${detail ? `:${detail}` : ''}`);
    this.name = 'ProviderHttpError';
    this.provider = provider;
    this.status = status;
    this.retryable = retryable;
  }
}

export class ProviderHttpClient {
  constructor({ provider, baseUrl, apiKey, timeoutMs = 8000, maxAttempts = 3, fetchImpl = fetch }) {
    if (!provider || !baseUrl || !apiKey) throw new Error('INVALID_PROVIDER_CLIENT_CONFIG');
    this.provider = provider;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.timeoutMs = timeoutMs;
    this.maxAttempts = maxAttempts;
    this.fetchImpl = fetchImpl;
  }

  async request(path, { method = 'GET', body, idempotencyKey, headers = {} } = {}) {
    if (method !== 'GET' && method !== 'HEAD' && !idempotencyKey) {
      throw new Error('IDEMPOTENCY_KEY_REQUIRED');
    }
    let lastError;
    for (let attempt = 1; attempt <= this.maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
          method,
          signal: controller.signal,
          headers: {
            authorization: `Bearer ${this.apiKey}`,
            accept: 'application/json',
            ...(body === undefined ? {} : { 'content-type': 'application/json' }),
            ...(idempotencyKey ? { 'idempotency-key': idempotencyKey } : {}),
            ...headers,
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        });
        const text = await response.text();
        const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
        if (!response.ok) {
          const error = new ProviderHttpError(this.provider, response.status, retryable, text.slice(0, 200));
          if (!retryable || attempt === this.maxAttempts) throw error;
          lastError = error;
        } else {
          return text ? JSON.parse(text) : {};
        }
      } catch (error) {
        const retryable = error?.name === 'AbortError' || error instanceof TypeError || error?.retryable === true;
        if (!retryable || attempt === this.maxAttempts) throw error;
        lastError = error;
      } finally {
        clearTimeout(timer);
      }
      await new Promise(resolve => setTimeout(resolve, Math.min(1000, 50 * 2 ** (attempt - 1))));
    }
    throw lastError ?? new Error('PROVIDER_REQUEST_FAILED');
  }
}

export class WebhookReplayGuard {
  constructor({ ttlMs = 5 * 60_000, now = () => Date.now() } = {}) {
    this.ttlMs = ttlMs;
    this.now = now;
    this.seen = new Map();
  }

  accept(eventId) {
    if (!eventId) throw new Error('WEBHOOK_EVENT_ID_REQUIRED');
    const time = this.now();
    for (const [key, expiresAt] of this.seen) if (expiresAt <= time) this.seen.delete(key);
    if (this.seen.has(eventId)) return false;
    this.seen.set(eventId, time + this.ttlMs);
    return true;
  }
}

export function verifySignedWebhook({ rawBody, signatureHex, timestampSeconds, secret, toleranceSeconds = 300, nowSeconds = Math.floor(Date.now() / 1000) }) {
  if (!Number.isInteger(timestampSeconds)) throw new Error('INVALID_WEBHOOK_TIMESTAMP');
  if (Math.abs(nowSeconds - timestampSeconds) > toleranceSeconds) throw new Error('STALE_WEBHOOK');
  const payload = `${timestampSeconds}.${rawBody}`;
  const expected = createHmac('sha256', secret).update(payload).digest();
  const actual = Buffer.from(signatureHex, 'hex');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error('INVALID_WEBHOOK_SIGNATURE');
  return JSON.parse(rawBody);
}
