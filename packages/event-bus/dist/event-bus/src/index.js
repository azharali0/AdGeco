export class InMemoryEventPublisher {
    events = [];
    async publish(event) { this.events.push(event); }
}
