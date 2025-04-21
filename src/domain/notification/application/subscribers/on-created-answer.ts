import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswerCreatedEvent } from '@/domain/forum/application/event/answer-created-event'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { SendNotificationUseCase } from '../../application/use-cases/send-notification-use-case'
import { Injectable } from '@nestjs/common'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

@Injectable()
export class OnCreatedAnswer implements EventHandler {
  constructor(
    private questionRepository: QuestionRepository,
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
        recipientId: question.authorId.toString(),
        title: `Nova pergunta em ${question.title
          .substring(0, 40)
          .concat('...')}`,
        content: answer.excerpt,
      })
    }
  }
}
