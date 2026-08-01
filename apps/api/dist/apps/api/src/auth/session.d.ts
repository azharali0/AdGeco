import type { TenantRole } from '@adgeco/contracts';
export interface SessionClaims {
    sub: string;
    organisationId: string;
    roles: TenantRole[];
    sessionId: string;
    type: 'access' | 'mfa';
}
export declare function signAccessSession(claims: Omit<SessionClaims, 'type'>, secret: string): Promise<string>;
export declare function signMfaChallenge(claims: Omit<SessionClaims, 'type' | 'sessionId'>, secret: string): Promise<string>;
export declare function verifySession(token: string, secret: string, expected?: 'access' | 'mfa'): Promise<SessionClaims>;
