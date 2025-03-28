import { UniqueEntityId } from '@/core/entities/unique-entity'
import { Notification } from '../../enterprise/entities/notification'
import { Either, right } from '@/core/either'
import { NotificationRepository } from '../repositories/notification-repository'

export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
  readAt?: string
}

export type SendNotificationUseCaseRespose = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseRespose> {
    const notification = Notification.create({
        recipientId: new UniqueEntityId(recipientId),
        title,
        content,
    })

    await this.notificationRepository.create(notification)

    return right({ notification })
  }
}
