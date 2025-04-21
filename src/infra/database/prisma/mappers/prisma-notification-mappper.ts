import { UniqueEntityId } from '@/core/entities/unique-entity'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Prisma, Notification as PrismaNotification } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityId(raw.recipientId),
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(notification: Notification): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      title: notification.title,    
      readAt: notification.readAt,
      content: notification.content,
      createdAt: notification.createdAt,
    }
  }
}
