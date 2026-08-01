export declare function servicePort(fallback: number): number;
export declare function requireServiceToken(value: string | undefined): void;
export declare function serviceAuthHeader(headers: Record<string, unknown>): string | undefined;
export declare function money(value: unknown): number;
export declare function json(value: unknown): Record<string, unknown>;
export declare function withSerializableRetry<T>(work: () => Promise<T>, attempts?: number): Promise<T>;
