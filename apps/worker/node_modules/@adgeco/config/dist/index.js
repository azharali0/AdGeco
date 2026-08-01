function required(name) { const value = process.env[name]; if (!value)
    throw new Error(`Missing environment variable: ${name}`); return value; }
function optional(name) { const value = process.env[name]?.trim(); return value || undefined; }
export function loadConfig() {
    const nodeEnv = process.env.NODE_ENV ?? 'development';
    const publicAppUrl = process.env.PUBLIC_APP_URL ?? 'http://localhost:3000';
    const config = { nodeEnv, port: Number(process.env.PORT ?? 4000), databaseUrl: required('DATABASE_URL'), redisUrl: required('REDIS_URL'), jwtSecret: required('JWT_SECRET'), tokenPepper: required('TOKEN_PEPPER'), publicAppUrl, serviceSecret: required('SERVICE_SECRET'), allowedOrigins: (process.env.ALLOWED_ORIGINS ?? publicAppUrl).split(',').map(v => v.trim()).filter(Boolean), paymentProviderUrl: optional('PAYMENT_PROVIDER_URL'), paymentProviderKey: optional('PAYMENT_PROVIDER_KEY'), paymentWebhookSecret: optional('PAYMENT_WEBHOOK_SECRET'), payoutProviderUrl: optional('PAYOUT_PROVIDER_URL'), payoutProviderKey: optional('PAYOUT_PROVIDER_KEY'), verificationProviderUrl: optional('VERIFICATION_PROVIDER_URL'), verificationProviderKey: optional('VERIFICATION_PROVIDER_KEY'), objectStoragePublicUrl: optional('OBJECT_STORAGE_PUBLIC_URL'), objectStorageUploadUrl: optional('OBJECT_STORAGE_UPLOAD_URL'), consentProviderUrl: optional('CONSENT_PROVIDER_URL'), consentProviderKey: optional('CONSENT_PROVIDER_KEY'), taxProviderUrl: optional('TAX_PROVIDER_URL'), taxProviderKey: optional('TAX_PROVIDER_KEY') };
    if (nodeEnv === 'production') {
        for (const key of ['paymentProviderUrl', 'paymentProviderKey', 'paymentWebhookSecret', 'payoutProviderUrl', 'payoutProviderKey', 'verificationProviderUrl', 'verificationProviderKey', 'objectStoragePublicUrl', 'objectStorageUploadUrl', 'consentProviderUrl', 'consentProviderKey', 'taxProviderUrl', 'taxProviderKey']) {
            if (!config[key])
                throw new Error(`Missing production integration configuration: ${key}`);
        }
    }
    if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535)
        throw new Error('PORT must be a valid TCP port');
    if (config.jwtSecret.length < 32 || config.tokenPepper.length < 32 || config.serviceSecret.length < 32)
        throw new Error('JWT_SECRET, TOKEN_PEPPER and SERVICE_SECRET must each be at least 32 characters');
    return config;
}
