export declare class JsonHttpClient {
    private baseUrl;
    private apiKey;
    constructor(baseUrl: string, apiKey: string);
    request(path: string, { method, body, idempotencyKey }?: any): Promise<any>;
}
export declare class HttpPayoutProvider {
    private client;
    constructor(baseUrl: string, apiKey: string);
    createBeneficiary(input: any): Promise<any>;
    sendPayout(input: any): Promise<any>;
    getPayout(reference: string): Promise<any>;
}
export declare class HttpVerificationProvider {
    private client;
    constructor(baseUrl: string, apiKey: string);
    createBusinessCheck(input: any): Promise<any>;
    getCheck(reference: string): Promise<any>;
}
export declare class HttpTaxProvider {
    private client;
    constructor(baseUrl: string, apiKey: string);
    quote(input: any): Promise<any>;
}
export declare class HttpConsentProvider {
    private client;
    constructor(baseUrl: string, apiKey: string);
    evaluate(input: any): Promise<any>;
}
export declare class S3CompatibleStorageProvider {
    private endpoint;
    private publicBaseUrl;
    constructor(endpoint: string, publicBaseUrl: string);
    createUpload(input: any): Promise<{
        uploadUrl: string;
        headers: {
            'content-type': any;
            'x-content-sha256': any;
        };
        assetUrl: string;
    }>;
    delete(key: string): Promise<void>;
}
export declare function verifyHmac(rawBody: string, signature: string, secret: string): boolean;
