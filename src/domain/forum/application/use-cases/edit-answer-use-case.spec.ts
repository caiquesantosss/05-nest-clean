import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { MakeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity'
import { EditAnswerUseCase } from './edit-answer-use-case'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { MakeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswerRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentRepository
    )
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: new UniqueEntityId('author-1').toString(),
      },
      new UniqueEntityId('answer-1')
    )

    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentRepository.items.push(
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
      answerId: newAnswer.id.toValue(),
      authorId: 'author-1',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '3'],
    })

    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1').toString(),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('3').toString(),
        }),
      ]
    )
  })

  it('should not be able to edit a answer', async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: new UniqueEntityId('author-1').toString(),
      },
      new UniqueEntityId('answer-1')
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author-2',
      content: 'Conteúdo da pergunta',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
