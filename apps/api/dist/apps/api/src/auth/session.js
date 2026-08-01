import { SignJWT, jwtVerify } from 'jose';
const key = (secret) => new TextEncoder().encode(secret);
export async function signAccessSession(claims, secret) { return new SignJWT({ organisationId: claims.organisationId, roles: claims.roles, sessionId: claims.sessionId, type: 'access' }).setProtectedHeader({ alg: 'HS256' }).setSubject(claims.sub).setIssuedAt().setExpirationTime('15m').sign(key(secret)); }
export async function signMfaChallenge(claims, secret) { return new SignJWT({ organisationId: claims.organisationId, roles: claims.roles, type: 'mfa' }).setProtectedHeader({ alg: 'HS256' }).setSubject(claims.sub).setIssuedAt().setExpirationTime('5m').sign(key(secret)); }
export async function verifySession(token, secret, expected = 'access') { const { payload } = await jwtVerify(token, key(secret)); if (!payload.sub || typeof payload.organisationId !== 'string' || !Array.isArray(payload.roles) || payload.type !== expected)
    throw new Error('INVALID_SESSION'); return { sub: payload.sub, organisationId: payload.organisationId, roles: payload.roles, sessionId: typeof payload.sessionId === 'string' ? payload.sessionId : '', type: expected }; }
