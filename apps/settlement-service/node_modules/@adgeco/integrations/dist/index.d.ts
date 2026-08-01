import { z } from 'zod';
export type Money = {
    amountMinor: number;
    currency: string;
};
export type ProviderResult<T> = {
    provider: string;
    reference: string;
    status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
    data: T;
};
export interface PaymentProvider {
    createFunding(input: {
        idempotencyKey: string;
        customerReference: string;
        money: Money;
        returnUrl: string;
    }): Promise<ProviderResult<{
        checkoutUrl?: string;
    }>>;
    refund(input: {
        idempotencyKey: string;
        paymentReference: string;
        money?: Money;
    }): Promise<ProviderResult<Record<string, unknown>>>;
    verifyWebhook(input: {
        rawBody: string;
        signature: string;
    }): Record<string, unknown>;
}
export interface PayoutProvider {
    createBeneficiary(input: {
        idempotencyKey: string;
        legalName: string;
        country: string;
        currency: string;
        bankToken: string;
    }): Promise<ProviderResult<Record<string, unknown>>>;
    sendPayout(input: {
        idempotencyKey: string;
        beneficiaryReference: string;
        money: Money;
        statementReference: string;
    }): Promise<ProviderResult<Record<string, unknown>>>;
    getPayout(reference: string): Promise<ProviderResult<Record<string, unknown>>>;
}
export interface VerificationProvider {
    createBusinessCheck(input: {
        idempotencyKey: string;
        organisationId: string;
        legalName: string;
        country: string;
        registrationNumber?: string;
        callbackUrl: string;
    }): Promise<ProviderResult<{
        hostedUrl?: string;
    }>>;
    getCheck(reference: string): Promise<ProviderResult<{
        decision?: 'APPROVED' | 'REJECTED' | 'REVIEW';
    }>>;
}
export interface ObjectStorageProvider {
    createUpload(input: {
        key: string;
        contentType: string;
        size: number;
        checksum: string;
        expiresInSeconds: number;
    }): Promise<{
        uploadUrl: string;
        headers: Record<string, string>;
        assetUrl: string;
    }>;
    delete(key: string): Promise<void>;
}
export interface ConsentProvider {
    evaluate(input: {
        country?: string;
        tcString?: string;
        gppString?: string;
        purposes: string[];
    }): Promise<{
        allowed: boolean;
        reasons: string[];
        policyVersion: string;
    }>;
}
export interface TaxProvider {
    quote(input: {
        sellerCountry: string;
        buyerCountry: string;
        money: Money;
        taxId?: string;
        productCode: string;
    }): Promise<{
        net: Money;
        tax: Money;
        gross: Money;
        rules: string[];
    }>;
}
declare const httpConfig: z.ZodObject<{
    baseUrl: z.ZodString;
    apiKey: z.ZodString;
    webhookSecret: z.ZodString;
    provider: z.ZodString;
}, "strip", z.ZodTypeAny, {
    baseUrl: string;
    apiKey: string;
    webhookSecret: string;
    provider: string;
}, {
    baseUrl: string;
    apiKey: string;
    webhookSecret: string;
    provider: string;
}>;
export declare class HttpPaymentProvider implements PaymentProvider {
    private readonly cfg;
    constructor(config: z.input<typeof httpConfig>);
    private call;
    createFunding(input: {
        idempotencyKey: string;
        customerReference: string;
        money: Money;
        returnUrl: string;
    }): Promise<{
        provider: string;
        reference: string;
        status: "PENDING";
        data: {
            checkoutUrl: string | undefined;
        };
    }>;
    refund(input: {
        idempotencyKey: string;
        paymentReference: string;
        money?: Money;
    }): Promise<{
        provider: string;
        reference: string;
        status: "PENDING";
        data: Record<string, unknown>;
    }>;
    verifyWebhook(input: {
        rawBody: string;
        signature: string;
    }): Record<string, unknown>;
}
export declare class HttpJsonProvider {
    private readonly baseUrl;
    private readonly apiKey;
    private readonly provider;
    constructor(baseUrl: string, apiKey: string, provider: string);
    post(path: string, body: unknown, idempotencyKey: string): Promise<Record<string, unknown>>;
    get(path: string): Promise<Record<string, unknown>>;
}
export declare function requireProductionIntegration(name: string, value: string | undefined, nodeEnv?: string | undefined): string | undefined;
export * from './providers.js';
