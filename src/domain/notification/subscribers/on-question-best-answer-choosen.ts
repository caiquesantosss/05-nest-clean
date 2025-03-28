import { DomainEvents } from '../../../core/events/domain-events'
import { EventHandler } from '../../../core/events/event-handler'
import { SendNotificationUseCase } from '../../notification/application/use-cases/send-notification-use-case'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/application/event/question-best-answer-choosen-event'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: InMemoryAnswerRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.senQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name
    )
  }

  private async senQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString()
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.AuthorId.toString(),
        title: 'Sua resposta foi escolhida"',
        content: `A resposta que você enviou em ${question.title
          .substring(0, 20)
          .concat('...')} foi escolhida pelo autor`,
      })
    }
  }
}
