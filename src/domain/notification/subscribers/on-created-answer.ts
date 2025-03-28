import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswerCreatedEvent } from '@/domain/forum/application/event/answer-created-event'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { SendNotificationUseCase } from '../application/use-cases/send-notification-use-case'

export class OnCreatedAnswer implements EventHandler {
  constructor(
    private questionRepository: InMemoryQuestionsRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionRepository.findById(
      answer.QuestionId.toString()
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.AuthorId.toString(),
        title: `Nova pergunta em ${question.Title.substring(0, 40).concat(
          '...'
        )}`,
        content: answer.excerpt,
      })
    }
  }
}
