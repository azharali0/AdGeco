export class HttpEmailProvider {
    endpoint;
    apiKey;
    from;
    constructor(endpoint, apiKey, from) {
        this.endpoint = endpoint;
        this.apiKey = apiKey;
        this.from = from;
    }
    async send(message) { const response = await fetch(this.endpoint, { method: 'POST', headers: { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json', 'idempotency-key': message.idempotencyKey }, body: JSON.stringify({ from: this.from, to: [message.to], subject: message.subject, html: message.html, text: message.text }) }); if (!response.ok)
        throw new Error(`EMAIL_PROVIDER_${response.status}`); const body = await response.json(); return { providerMessageId: body.id ?? message.idempotencyKey }; }
}
export class ConsoleEmailProvider {
    async send(message) { console.info(JSON.stringify({ event: 'email.development', to: message.to, subject: message.subject, idempotencyKey: message.idempotencyKey })); return { providerMessageId: `dev:${message.idempotencyKey}` }; }
}
