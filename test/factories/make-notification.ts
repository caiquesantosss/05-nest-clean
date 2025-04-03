import {
    Notification,
    NotificationProps,
  } from '../../src/domain/notification/enterprise/entities/notification'
  import { UniqueEntityId } from '../../src/core/entities/unique-entity'
  import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
  
  export function MakeNotification(
    override: Partial<NotificationProps> = {},
    id?: UniqueEntityId
  ) {
    const notification = Notification.create(
      {
        recipientId: new UniqueEntityId(),
        title: faker.lorem.sentence(4),
        content: faker.lorem.sentence(4),
        ...override,
      },
      id
    )
  
    return notification
  }

/*   @Injectable()
  export class NotificationFactory {
    constructor(private prisma: PrismaService) {}
  
    async MakePrismaNotification(
      data: Partial<NotificationProps> = {}
    ): Promise<Notification> {
      const Notification = MakeNotification(data)
  
      await this.prisma.attachment.create({
        data: PrismaNotificationMapper.toPrisma(Notification),
      })
  
      return Notification
    }
} */
  