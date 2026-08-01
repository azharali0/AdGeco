import type { CanonicalEvent } from '@adgeco/contracts';
export interface EventPublisher { publish<T>(event: CanonicalEvent<T>): Promise<void>; }
export class InMemoryEventPublisher implements EventPublisher {
  readonly events: CanonicalEvent[] = [];
  async publish<T>(event: CanonicalEvent<T>): Promise<void> { this.events.push(event as CanonicalEvent); }
}
