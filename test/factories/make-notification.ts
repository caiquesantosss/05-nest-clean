import {
    Notification,
    NotificationProps,
  } from '../../src/domain/notification/enterprise/entities/notification'
  import { UniqueEntityId } from '../../src/core/entities/unique-entity'
  import { faker } from '@faker-js/faker';
  
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
  