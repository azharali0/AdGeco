import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual, createHmac, createCipheriv, createDecipheriv } from 'node:crypto';
import { promisify } from 'node:util';
import type { RequestContext, TenantRole } from '@adgeco/contracts';

const scrypt = promisify(scryptCallback);
const PASSWORD_MIN_LENGTH = 12;

export const permissions = {
  'organisation:read': ['SUPER_ADMIN','PLATFORM_ADMIN','PUBLISHER_OWNER','PUBLISHER_ADMIN','ADVERTISER_OWNER','ADVERTISER_ADMIN','AGENCY_OWNER','AGENCY_ADMIN','ANALYST'],
  'organisation:manage': ['SUPER_ADMIN','PLATFORM_ADMIN','PUBLISHER_OWNER','PUBLISHER_ADMIN','ADVERTISER_OWNER','ADVERTISER_ADMIN','AGENCY_OWNER','AGENCY_ADMIN'],
  'membership:invite': ['SUPER_ADMIN','PLATFORM_ADMIN','PUBLISHER_OWNER','PUBLISHER_ADMIN','ADVERTISER_OWNER','ADVERTISER_ADMIN','AGENCY_OWNER','AGENCY_ADMIN'],
  'credential:manage': ['SUPER_ADMIN','PLATFORM_ADMIN','PUBLISHER_OWNER','PUBLISHER_ADMIN','ADVERTISER_OWNER','ADVERTISER_ADMIN','AGENCY_OWNER','AGENCY_ADMIN'],
  'platform:admin': ['SUPER_ADMIN','PLATFORM_ADMIN'],
  'finance:operate': ['SUPER_ADMIN','FINANCE_OPS'],
  'marketplace:operate': ['SUPER_ADMIN','MARKETPLACE_OPS'],
  'publisher:read': ['SUPER_ADMIN','PLATFORM_ADMIN','MARKETPLACE_OPS','PUBLISHER_OWNER','PUBLISHER_ADMIN','INVENTORY_MANAGER','ANALYST'],
  'publisher:manage': ['SUPER_ADMIN','PLATFORM_ADMIN','PUBLISHER_OWNER','PUBLISHER_ADMIN'],
  'publisher:verify': ['SUPER_ADMIN','PLATFORM_ADMIN','MARKETPLACE_OPS'],
  'property:manage': ['SUPER_ADMIN','PLATFORM_ADMIN','PUBLISHER_OWNER','PUBLISHER_ADMIN','INVENTORY_MANAGER'],
  'placement:manage': ['SUPER_ADMIN','PLATFORM_ADMIN','PUBLISHER_OWNER','PUBLISHER_ADMIN','INVENTORY_MANAGER'],
  'payout:manage': ['SUPER_ADMIN','PLATFORM_ADMIN','PUBLISHER_OWNER','PUBLISHER_ADMIN','FINANCE_OPS'],
  'advertiser:read': ['SUPER_ADMIN','PLATFORM_ADMIN','MARKETPLACE_OPS','ADVERTISER_OWNER','ADVERTISER_ADMIN','CAMPAIGN_MANAGER','MEDIA_BUYER','ANALYST'],
  'advertiser:manage': ['SUPER_ADMIN','PLATFORM_ADMIN','ADVERTISER_OWNER','ADVERTISER_ADMIN'],
  'wallet:fund': ['SUPER_ADMIN','PLATFORM_ADMIN','FINANCE_OPS','ADVERTISER_OWNER','ADVERTISER_ADMIN'],
  'campaign:manage': ['SUPER_ADMIN','PLATFORM_ADMIN','ADVERTISER_OWNER','ADVERTISER_ADMIN','CAMPAIGN_MANAGER','MEDIA_BUYER'],
  'campaign:approve': ['SUPER_ADMIN','PLATFORM_ADMIN','MARKETPLACE_OPS'],
  'creative:manage': ['SUPER_ADMIN','PLATFORM_ADMIN','ADVERTISER_OWNER','ADVERTISER_ADMIN','CAMPAIGN_MANAGER','MEDIA_BUYER'],
  'creative:review': ['SUPER_ADMIN','PLATFORM_ADMIN','MARKETPLACE_OPS'],
  'settlement:operate': ['SUPER_ADMIN','PLATFORM_ADMIN','FINANCE_OPS'],
  'operations:read': ['SUPER_ADMIN','PLATFORM_ADMIN','MARKETPLACE_OPS','FINANCE_OPS','FRAUD_ANALYST','SUPPORT_AGENT','AUDITOR'],
  'operations:manage': ['SUPER_ADMIN','PLATFORM_ADMIN','MARKETPLACE_OPS'],
  'fraud:investigate': ['SUPER_ADMIN','PLATFORM_ADMIN','FRAUD_ANALYST'],
  'support:operate': ['SUPER_ADMIN','PLATFORM_ADMIN','SUPPORT_AGENT'],
  'incident:manage': ['SUPER_ADMIN','PLATFORM_ADMIN','MARKETPLACE_OPS'],
} as const satisfies Record<string, readonly TenantRole[]>;

export type Permission = keyof typeof permissions;
export function authorise(ctx: RequestContext, permission: Permission): void {
  const allowed = permissions[permission];
  if (!ctx.roles.some((role) => allowed.includes(role as never))) throw new Error(`FORBIDDEN:${permission}`);
}
export function assertTenant(ctx: RequestContext, organisationId: string): void {
  if (ctx.organisationId !== organisationId && !ctx.roles.includes('SUPER_ADMIN')) throw new Error('TENANT_BOUNDARY_VIOLATION');
}
export function validatePassword(password: string): void {
  if (password.length < PASSWORD_MIN_LENGTH || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    throw new Error('WEAK_PASSWORD');
  }
}
export async function hashPassword(password: string): Promise<string> {
  validatePassword(password);
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, 64) as Buffer;
  return `scrypt$${salt}$${derived.toString('hex')}`;
}
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, salt, hash] = stored.split('$');
  if (algorithm !== 'scrypt' || !salt || !hash) return false;
  const derived = await scrypt(password, salt, 64) as Buffer;
  const expected = Buffer.from(hash, 'hex');
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}
export function randomToken(bytes = 32): string { return randomBytes(bytes).toString('base64url'); }
export function hashToken(token: string): string { return createHash('sha256').update(token).digest('hex'); }

const BASE32='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function generateTotpSecret(): string { let out=''; const bytes=randomBytes(20); for(const byte of bytes) out += BASE32[byte % 32]; return out; }
function decodeBase32(value:string):Buffer { let bits=''; for(const char of value.replace(/=+$/,'').toUpperCase()) { const i=BASE32.indexOf(char); if(i<0) throw new Error('INVALID_MFA_SECRET'); bits += i.toString(2).padStart(5,'0'); } const bytes=[]; for(let i=0;i+8<=bits.length;i+=8) bytes.push(parseInt(bits.slice(i,i+8),2)); return Buffer.from(bytes); }
export function totp(secret:string, time=Date.now(), step=30):string { const counter=Math.floor(time/1000/step); const buffer=Buffer.alloc(8); buffer.writeBigUInt64BE(BigInt(counter)); const digest=createHmac('sha1',decodeBase32(secret)).update(buffer).digest(); const offset=digest[digest.length-1]&15; const code=((digest[offset]&127)<<24)|((digest[offset+1]&255)<<16)|((digest[offset+2]&255)<<8)|(digest[offset+3]&255); return String(code%1_000_000).padStart(6,'0'); }
export function verifyTotp(secret:string, code:string, now=Date.now()):boolean { return [-1,0,1].some((w)=>{ const expected=totp(secret,now+w*30_000); return expected.length===code.length && timingSafeEqual(Buffer.from(expected),Buffer.from(code)); }); }

export function encryptSecret(value:string, pepper:string):string { const key=createHash('sha256').update(pepper).digest(); const iv=randomBytes(12); const cipher=createCipheriv('aes-256-gcm',key,iv); const ciphertext=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]); const tag=cipher.getAuthTag(); return [iv,tag,ciphertext].map((b)=>b.toString('base64url')).join('.'); }
export function decryptSecret(value:string, pepper:string):string { const [iv,tag,ciphertext]=value.split('.').map((v)=>Buffer.from(v,'base64url')); const key=createHash('sha256').update(pepper).digest(); const decipher=createDecipheriv('aes-256-gcm',key,iv); decipher.setAuthTag(tag); return Buffer.concat([decipher.update(ciphertext),decipher.final()]).toString('utf8'); }
