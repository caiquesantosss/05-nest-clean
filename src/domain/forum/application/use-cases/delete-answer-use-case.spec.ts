import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { MakeAnswer } from 'test/factories/make-answer'
import { DeleteAnswerUseCase } from './delete-answer-use-case'
import { UniqueEntityId } from '@/core/entities/unique-entity'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { MakeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswerRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswersAttachmentRepository
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: new UniqueEntityId('author-1').toString(),
      },
      new UniqueEntityId('answer-1')
    )

    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswersAttachmentRepository.items.push(
      MakeAnswerAttachment({
        answerId: newAnswer.id.toString(),
        attachmentId: new UniqueEntityId('1').toString(),
      }),
      MakeAnswerAttachment({
        answerId: newAnswer.id.toString(),
        attachmentId: new UniqueEntityId('2').toString(),
      })
    )

    await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswersAttachmentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer', async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: new UniqueEntityId('author-1').toString(),
      },
      new UniqueEntityId('answer-1')
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
  })
})
