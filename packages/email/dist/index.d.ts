export interface EmailMessage {
    to: string;
    subject: string;
    html: string;
    text: string;
    idempotencyKey: string;
}
export interface EmailProvider {
    send(message: EmailMessage): Promise<{
        providerMessageId: string;
    }>;
}
export declare class HttpEmailProvider implements EmailProvider {
    private readonly endpoint;
    private readonly apiKey;
    private readonly from;
    constructor(endpoint: string, apiKey: string, from: string);
    send(message: EmailMessage): Promise<{
        providerMessageId: string;
    }>;
}
export declare class ConsoleEmailProvider implements EmailProvider {
    send(message: EmailMessage): Promise<{
        providerMessageId: string;
    }>;
}
