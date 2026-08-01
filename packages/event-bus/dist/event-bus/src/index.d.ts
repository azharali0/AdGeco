import type { CanonicalEvent } from '@adgeco/contracts';
export interface EventPublisher {
    publish<T>(event: CanonicalEvent<T>): Promise<void>;
}
export declare class InMemoryEventPublisher implements EventPublisher {
    readonly events: CanonicalEvent[];
    publish<T>(event: CanonicalEvent<T>): Promise<void>;
}
