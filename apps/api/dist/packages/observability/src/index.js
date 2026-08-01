import { randomUUID } from 'node:crypto';
const counters = new Map();
const gauges = new Map();
function write(level, message, fields = {}) { process.stdout.write(`${JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...fields })}\n`); }
export const logger = { info: (message, fields) => write('info', message, fields), warn: (message, fields) => write('warn', message, fields), error: (message, fields) => write('error', message, fields) };
export function requestId(value) { return value?.trim() || randomUUID(); }
export function incrementMetric(name, value = 1) { counters.set(name, (counters.get(name) ?? 0) + value); }
export function setGauge(name, value) { gauges.set(name, value); }
export function prometheusMetrics() { const sanitize = (v) => v.replace(/[^a-zA-Z0-9_:]/g, '_'); return [...[...counters].map(([k, v]) => `${sanitize(k)}_total ${v}`), ...[...gauges].map(([k, v]) => `${sanitize(k)} ${v}`)].join('\n') + '\n'; }
