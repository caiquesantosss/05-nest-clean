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
    inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentRepository
    )
  })

  it('should be able to edit an answer', async () => {
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

    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({
            answerId: 'answer-1',
            attachmentId: '1',
          }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({
            answerId: 'answer-1',
            attachmentId: '3',
          }),
        }),
      ])
    )
  })

  it('should not be able to edit an answer if user is not author', async () => {
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

  it('should sync new and remove attachments when editing an answer', async () => {
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

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-1',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2)
    expect(inMemoryAnswerAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({
            answerId: 'answer-1',
            attachmentId: '1',
          }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({
            answerId: 'answer-1',
            attachmentId: '3',
          }),
        }),
      ])
    )
  })
})
