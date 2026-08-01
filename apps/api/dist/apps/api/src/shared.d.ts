import { z } from 'zod';
import { type RequestContext, type TenantRole } from '@adgeco/contracts';
import type { FastifyRequest } from 'fastify';
export declare const config: import("@adgeco/config").RuntimeConfig;
export declare const email: z.ZodEffects<z.ZodString, string, string>;
export declare const role: z.ZodEnum<[TenantRole, ...TenantRole[]]>;
export declare const orgType: z.ZodEnum<["PUBLISHER", "ADVERTISER", "AGENCY"]>;
export declare const tokenHash: (value: string) => string;
export declare const deliveryToken: (payload: Record<string, unknown>) => string;
export declare const verifyDeliveryToken: (token: string) => {
    deliveryId: string;
    decisionId: string;
    exp: number;
};
export declare const deliveryBearer: (req: FastifyRequest) => {
    deliveryId: string;
    decisionId: string;
    exp: number;
};
export declare const bearer: (req: FastifyRequest) => string;
export declare function context(req: FastifyRequest): Promise<RequestContext>;
export declare function rolesFor(userId: string, organisationId: string): Promise<TenantRole[]>;
export declare function audit(args: {
    organisationId?: string;
    actorId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    requestId: string;
    metadata?: Record<string, unknown>;
}): Promise<void>;
export declare function event(type: string, organisationId: string | undefined, payload: Record<string, unknown>, correlationId: string): Promise<void>;
export declare function issueSession(userId: string, organisationId: string, roles: TenantRole[], req: FastifyRequest): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    sessionId: string;
}>;
