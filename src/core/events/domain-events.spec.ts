import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
    public ocurredAt: Date 
    private aggregateId: CustomAggregate

    constructor(aggregate: CustomAggregate) {
        this.ocurredAt = new Date()
        this.aggregateId = aggregate
    }

    public getAggregateId(): UniqueEntityId {
        return this.aggregateId.id
    }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
    it('should be able dispatch and listen the events', () => {
        const callbackSpy = vi.fn()

        DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

        const aggregate = CustomAggregate.create()

        expect(aggregate.domainEvents).toHaveLength(1)

        DomainEvents.dispatchEventsForAggregate(aggregate.id)
        
        expect(callbackSpy).toHaveBeenCalledTimes(1)
        expect(aggregate.domainEvents).toHaveLength(0)
    })
})
