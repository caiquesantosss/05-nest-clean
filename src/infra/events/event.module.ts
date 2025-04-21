import { OnCreatedAnswer } from '@/domain/notification/application/subscribers/on-created-answer'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-choosen'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification-use-case'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnCreatedAnswer,
    OnQuestionBestAnswerChosen,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
