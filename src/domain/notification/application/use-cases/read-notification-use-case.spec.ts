import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { MakeNotification } from '../../../../../test/factories/make-notification'
import { ReadNotificationUseCase } from './read-notification-use-case'
let inMemoryNotificaitonRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('Read a Notification', () => {
  beforeEach(() => {
    inMemoryNotificaitonRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificaitonRepository)
  })

  it('should be able to Read a notification', async () => {
    const notification = MakeNotification()

    await inMemoryNotificaitonRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificaitonRepository.items[0].readAt).toEqual(
        expect.any(Date)
    ) 
  })
})
