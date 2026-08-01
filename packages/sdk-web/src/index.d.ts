export type AdRequest = {
    placementId: string;
    deviceId?: string;
    country?: string;
    language?: string;
    consent?: Record<string, unknown>;
};
export type AdResponse = {
    requestId: string;
    decisionId?: string;
    deliveryToken?: string;
    assetUrl?: string;
    clickUrl?: string;
    noFillReason?: string;
};
export declare class AdGecoWebClient {
    private readonly baseUrl;
    private readonly sdkKey;
    private readonly timeoutMs;
    constructor(baseUrl: string, sdkKey: string, timeoutMs?: number);
    private call;
    requestAd(request: AdRequest): Promise<AdResponse>;
    trackRender(deliveryToken: string, visiblePercentage: number, durationMs: number): Promise<unknown>;
    trackVideo(deliveryToken: string, quartile: 'START' | 'FIRST_QUARTILE' | 'MIDPOINT' | 'THIRD_QUARTILE' | 'COMPLETE'): Promise<unknown>;
    trackConversion(deliveryToken: string, type: string, valueMicros?: number): Promise<unknown>;
    renderImage(container: HTMLElement, response: AdResponse): Promise<void>;
}
