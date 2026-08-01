export interface RuntimeConfig {
    nodeEnv: string;
    port: number;
    databaseUrl: string;
    redisUrl: string;
    jwtSecret: string;
    tokenPepper: string;
    publicAppUrl: string;
    paymentProviderUrl?: string;
    paymentProviderKey?: string;
    paymentWebhookSecret?: string;
    payoutProviderUrl?: string;
    payoutProviderKey?: string;
    verificationProviderUrl?: string;
    verificationProviderKey?: string;
    objectStoragePublicUrl?: string;
    objectStorageUploadUrl?: string;
    consentProviderUrl?: string;
    consentProviderKey?: string;
    taxProviderUrl?: string;
    taxProviderKey?: string;
    serviceSecret: string;
    allowedOrigins: string[];
}
export declare function loadConfig(): RuntimeConfig;
