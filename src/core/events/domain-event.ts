import { UniqueEntityId } from "../entities/unique-entity"
export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityId
}
