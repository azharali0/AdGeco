export type UUID = string;
export type TenantRole = 'SUPER_ADMIN' | 'PLATFORM_ADMIN' | 'MARKETPLACE_OPS' | 'FINANCE_OPS' | 'FRAUD_ANALYST' | 'SUPPORT_AGENT' | 'AUDITOR' | 'PUBLISHER_OWNER' | 'PUBLISHER_ADMIN' | 'INVENTORY_MANAGER' | 'ADVERTISER_OWNER' | 'ADVERTISER_ADMIN' | 'CAMPAIGN_MANAGER' | 'AGENCY_OWNER' | 'AGENCY_ADMIN' | 'MEDIA_BUYER' | 'ANALYST';
export declare const tenantRoles: TenantRole[];
export interface RequestContext {
    requestId: UUID;
    actorId: UUID;
    organisationId: UUID;
    roles: TenantRole[];
    sessionId?: UUID;
}
export interface CanonicalEvent<TPayload = unknown> {
    id: UUID;
    type: string;
    version: number;
    occurredAt: string;
    acceptedAt: string;
    producer: string;
    organisationId?: UUID;
    correlationId: UUID;
    causationId?: UUID;
    payload: TPayload;
}
