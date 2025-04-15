import { UniqueEntityId } from '@/core/entities/unique-entity'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: AnswerQuestionUseCase

describe('Create an Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'Eu quero fazer uma resposta!',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer)
    expect(
      inMemoryAnswerRepository.items[0].attachments.currentItems
    ).toHaveLength(2)
    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityId('1').toString(),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityId('2').toString(),
      }),
    ])
  })

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'Eu quero fazer uma pergunta!',
      attachmentsIds: ['1', '2'],
    })
  
    expect(result.isRight()).toBe(true)
  
    const answer = result.value?.answer
  
    expect(answer).toBeDefined()
    expect(answer?.attachments.currentItems).toHaveLength(2)
    expect(answer?.attachments.currentItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({
            attachmentId: '1',
          }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({
            attachmentId: '2',
          }),
        }),
      ])
    )
  })
}) 
