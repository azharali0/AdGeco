
import { z } from 'zod';
import { randomUUID, createHmac, timingSafeEqual } from 'node:crypto';
import { loadConfig } from '@adgeco/config';
import { prisma, Prisma } from '@adgeco/database';
import { tenantRoles, type RequestContext, type TenantRole } from '@adgeco/contracts';
import type { FastifyRequest } from 'fastify';
import { signAccessSession, signMfaChallenge, verifySession } from './auth/session.js';
import { assertTenant, authorise, decryptSecret, encryptSecret, generateTotpSecret, hashPassword, hashToken, randomToken, verifyPassword, verifyTotp } from '@adgeco/auth';

export const config=loadConfig();
export const email=z.string().email().transform(v=>v.trim().toLowerCase());
export const role=z.enum(tenantRoles as [TenantRole,...TenantRole[]]);
export const orgType=z.enum(['PUBLISHER','ADVERTISER','AGENCY']);
export const tokenHash=(value:string)=>hashToken(`${config.tokenPepper}:${value}`);
export const deliveryToken=(payload:Record<string,unknown>)=>{const encoded=Buffer.from(JSON.stringify(payload)).toString('base64url');const signature=createHmac('sha256',config.tokenPepper).update(encoded).digest('base64url');return `${encoded}.${signature}`;};
export const verifyDeliveryToken=(token:string)=>{const [encoded,signature]=token.split('.');if(!encoded||!signature)throw new Error('INVALID_DELIVERY_TOKEN');const expected=createHmac('sha256',config.tokenPepper).update(encoded).digest();const actual=Buffer.from(signature,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new Error('INVALID_DELIVERY_TOKEN');const payload=JSON.parse(Buffer.from(encoded,'base64url').toString('utf8')) as {deliveryId:string;decisionId:string;exp:number};if(payload.exp<=Date.now())throw new Error('DELIVERY_TOKEN_EXPIRED');return payload;};
export const deliveryBearer=(req:FastifyRequest)=>{const header=req.headers.authorization;const candidate=typeof header==='string'&&header.startsWith('Delivery ')?header.slice(9):String(req.headers['x-adgeco-delivery-token']??'');return verifyDeliveryToken(z.string().min(20).parse(candidate));};
export const bearer=(req:FastifyRequest)=>{ const parsed=z.string().regex(/^Bearer\s+\S+$/).safeParse(req.headers.authorization); if(!parsed.success) throw new Error('UNAUTHENTICATED'); return parsed.data.slice(7); };

export async function context(req:FastifyRequest):Promise<RequestContext>{
  const claims=await verifySession(bearer(req),config.jwtSecret);
  const session=await prisma.session.findFirst({where:{id:claims.sessionId,userId:claims.sub,organisationId:claims.organisationId,revokedAt:null,expiresAt:{gt:new Date()}}});
  if(!session) throw new Error('SESSION_REVOKED');
  return {requestId:req.id,actorId:claims.sub,organisationId:claims.organisationId,roles:claims.roles,sessionId:session.id};
}
export async function rolesFor(userId:string,organisationId:string):Promise<TenantRole[]>{ const rows=await prisma.organisationMembership.findMany({where:{userId,organisationId,status:'ACTIVE'},select:{role:true}}); return rows.map(r=>r.role).filter((r):r is TenantRole=>tenantRoles.includes(r as TenantRole)); }
export async function audit(args:{organisationId?:string;actorId?:string;action:string;entityType:string;entityId?:string;requestId:string;metadata?:Record<string,unknown>}){ await prisma.auditLog.create({data:{organisationId:args.organisationId,actorId:args.actorId,action:args.action,entityType:args.entityType,entityId:args.entityId,requestId:args.requestId,metadata:(args.metadata??{}) as Prisma.InputJsonValue}}); }
export async function event(type:string,organisationId:string|undefined,payload:Record<string,unknown>,correlationId:string){ await prisma.outboxEvent.create({data:{organisationId,type,correlationId,payload:payload as Prisma.InputJsonValue}}); }
export async function issueSession(userId:string,organisationId:string,roles:TenantRole[],req:FastifyRequest){ const refresh=randomToken(48); const session=await prisma.session.create({data:{userId,organisationId,refreshTokenHash:tokenHash(refresh),userAgent:req.headers['user-agent'],ipAddress:req.ip,expiresAt:new Date(Date.now()+30*24*60*60*1000)}}); const accessToken=await signAccessSession({sub:userId,organisationId,roles,sessionId:session.id},config.jwtSecret); return {accessToken,refreshToken:refresh,expiresIn:900,sessionId:session.id}; }
