import { UniqueEntityId } from '@/core/entities/unique-entity'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { SendNotificationUseCase } from './send-notification-use-case'

let inMemoryNotificaitonRepository: InMemoryNotificationRepository
let sut: SendNotificationUseCase

describe('Create a Notification', () => {
  beforeEach(() => {
    inMemoryNotificaitonRepository = new InMemoryNotificationRepository()

    sut = new SendNotificationUseCase(inMemoryNotificaitonRepository)
  })

  it('should be able to create a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova notificação!',
      content: 'Eu quero fazer uma notificação!!',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificaitonRepository.items[0]).toEqual(result.value?.notification)
  })
})
