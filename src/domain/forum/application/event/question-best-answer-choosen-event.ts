import { UniqueEntityId } from '@/core/entities/unique-entity'
import { DomainEvent } from '@/core/events/domain-event'
import { Answer } from '../../enterprise/entities/answer'
import { Question } from '../../enterprise/entities/question'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityId
  constructor(question: Question, bestAnswerId: UniqueEntityId) {
    this.question = question
    this.bestAnswerId = bestAnswerId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id
  }
}
