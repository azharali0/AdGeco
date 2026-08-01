type Fields = Record<string, unknown>;
export declare const logger: {
    info: (message: string, fields?: Fields) => void;
    warn: (message: string, fields?: Fields) => void;
    error: (message: string, fields?: Fields) => void;
};
export declare function requestId(value?: string): string;
export declare function incrementMetric(name: string, value?: number): void;
export declare function setGauge(name: string, value: number): void;
export declare function prometheusMetrics(): string;
export {};
